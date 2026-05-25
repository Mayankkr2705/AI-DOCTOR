import Report from '../models/Report.js';
import axios from 'axios';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function getTextFromBuffer(buffer, originalname) {
  const extension = path.extname(originalname).toLowerCase();

  if (extension === '.pdf') {
    const parser = new PDFParse({ data: buffer });
    try {
      const data = await parser.getText();
      return data.text;
    } catch (error) {
      console.error('Error parsing PDF from buffer:', error);
      throw new Error('Could not read text from the PDF buffer.');
    } finally {
      await parser.destroy().catch(() => { });
    }
  }

  return buffer.toString('utf8');
}

export const uploadReport = async (req, res) => {
  try {
    const { title, description, reportType } = req.body;
    const userId = req.user._id || req.user.id;

    if (!title || !reportType) {
      return res.status(400).json({ message: 'Title and report type are required.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Report file is required.' });
    }
    const reportContent = await getTextFromBuffer(req.file.buffer, req.file.originalname);
    if (!reportContent) {
      return res.status(400).json({ message: 'Could not extract text from the uploaded file.' });
    }

    const newReport = new Report({
      userId,
      title,
      description,
      reportType,
      reportData: reportContent,
    });

    await newReport.save();

    let cloudinaryResult;
    try {
      cloudinaryResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'reports',
            public_id: `report-${Date.now()}-${path.parse(req.file.originalname).name}`,
            resource_type: 'raw', // Use 'raw' for non-image files like PDF/TXT
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
    } catch (uploadError) {
      // Clean up the created report if Cloudinary upload fails
      await Report.deleteOne({ _id: newReport._id });
      throw new Error(`Cloudinary upload failed: ${uploadError.message}`);
    }

    newReport.fileUrl = cloudinaryResult.secure_url;
    newReport.fileName = cloudinaryResult.public_id;
    await newReport.save();

    res.status(201).json({
      message: 'Report uploaded and text extracted successfully!',
      report: newReport,
    });
  } catch (error) {
    console.error('Error uploading report:', error);
    res.status(500).json({ message: error.message || 'Server error while uploading report.' });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching reports.' });
  }
};

export const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: reportId, userId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id || req.user.id;

    const report = await Report.findOne({ _id: reportId, userId });

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // Delete from Cloudinary
    if (report.fileName) {
      // For 'raw' files, you need to specify the resource_type
      await cloudinary.uploader.destroy(report.fileName, { resource_type: 'raw' });
    }

    await Report.deleteOne({ _id: reportId });

    res.status(200).json({ message: 'Report deleted successfully.' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error while deleting report.' });
  }
};

export const analyzeReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id || req.user.id;

    const report = await Report.findOne({ _id: reportId, userId });

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    // The reportData is already in the database
    const reportContent = report.reportData;

    if (!reportContent) {
      return res.status(400).json({ message: 'Could not find content for the report.' });
    }

    let analysisText;

    // Try Groq API, fallback to mock analysis if unavailable
    if (GROQ_API_KEY) {
      try {
        const prompt = `You are a medical AI assistant. Analyze the following medical report data and provide:
            1. A brief summary
            2. Key findings (as bullet points)
            3. General recommendations (as bullet points)

            Remember: This is not a substitute for professional medical advice. Always recommend consulting healthcare professionals.

            Report Type: ${report.reportType}
            Report Title: ${report.title}
            Report Data:
            ${reportContent}

            Provide your analysis in a structured format.`;

        const groqResponse = await axios.post(
          GROQ_API_URL,
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are a medical AI assistant that analyzes medical reports and provides structured analysis.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2048
          },
          {
            headers: {
              'Authorization': `Bearer ${GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        analysisText = groqResponse.data.choices[0].message.content;
      } catch (apiError) {
        console.error('Groq API Error:', apiError.response?.data || apiError.message);
        analysisText = getMockAnalysis(report);
      }
    } else {
      analysisText = getMockAnalysis(report);
    }

    // Parse the analysis (simple parsing - can be enhanced)
    const summary = analysisText.substring(0, 500);
    const findings = extractBulletPoints(analysisText, 'findings');
    const recommendations = extractBulletPoints(analysisText, 'recommendations');

    // Update report with analysis
    report.analysis = {
      summary,
      findings,
      recommendations,
      analyzedAt: new Date()
    };
    report.status = 'analyzed';
    await report.save();

    res.json({
      message: 'Report analyzed successfully',
      report
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze report', details: error.message });
  }
};

function extractBulletPoints(text, section) {
  const points = [];
  const lines = text.split('\n');
  let inSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes(section)) {
      inSection = true;
      continue;
    }
    if (inSection && (line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*'))) {
      points.push(line.trim().replace(/^[-•*]\s*/, ''));
    }
    if (inSection && points.length > 0 && line.trim() === '') {
      break;
    }
  }

  return points.length > 0 ? points : ['Analysis completed. Please review the full summary.'];
}

function getMockAnalysis(report) {
  return `This is a mock medical report analysis for ${report.title || 'the report'}. 
Please note that this is an automated placeholder analysis and does not replace professional medical advice.

Key Findings:
- The uploaded report type is ${report.reportType || 'not specified'}.
- No abnormal findings are detected in this simulated scan/text extraction.
- The document has been successfully stored and indexed for reference.

Recommendations:
- Consult with your primary care physician to discuss the results in detail.
- Keep a digital and physical copy of your medical records.
- Follow up with any scheduled check-ups or routine screenings.`;
}

// Get user reports
export const getReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




