const Report = require('../models/Report');
const axios = require('axios');
const fs = require('fs/promises');     // Provides methods to interact with the file system using Promises (async/await)
const path = require('path');          // Utility for handling and transforming file paths (ensures cross-platform compatibility)
const { CanvasFactory } = require('pdf-parse/worker');
const { PDFParse } = require('pdf-parse');

class UploadValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UploadValidationError';
    this.statusCode = 400;
  }
}

let pdfJsLib;

async function getPdfJsLib() {
  if (!pdfJsLib) {
    const imported = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfJsLib = imported;
  }
  return pdfJsLib;
}

async function extractPdfTextWithPdfJs(buffer) {
  const { getDocument } = await getPdfJsLib();
  const loadingTask = getDocument({ data: new Uint8Array(buffer), disableWorker: true });
  const pdf = await loadingTask.promise;

  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();

    if (text) {
      pageTexts.push(text);
    }
  }

  return pageTexts.join('\n').trim();
}

async function extractPdfTextWithPdfParse(buffer) {
  const parser = new PDFParse({ data: buffer, CanvasFactory });

  try {
    const parsed = await parser.getText();
    return (parsed?.text || '').trim();
  } finally {
    await parser.destroy().catch(() => {
      // Ignore parser cleanup errors
    });
  }
}

// Groq API configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Mock analysis generator when API is unavailable
function getMockAnalysis(report) {
  return `## Summary
This is an automated analysis of your ${report.reportType || 'medical'} report titled "${report.title}".

The report has been received and processed. Due to the AI service being temporarily unavailable, this is a placeholder analysis. Please consult with your healthcare provider for accurate interpretation of your results.

## Key Findings
- Report type: ${report.reportType || 'General'}
- Report submitted successfully
- Data received for analysis
- Awaiting full AI analysis (service temporarily unavailable)

## Recommendations
- Schedule a follow-up appointment with your healthcare provider
- Bring this report to your next medical consultation
- Keep track of any symptoms or changes
- Maintain a healthy lifestyle with proper diet and exercise
- Stay hydrated and get adequate rest

⚠️ **Disclaimer:** This is a demo analysis. The AI service is currently unavailable. For accurate medical interpretation, please consult a qualified healthcare professional.`;
}

async function extractTextFromFile(file) {
  if (!file) return '';

  const extension = path.extname(file.originalname || '').toLowerCase();
  const mimeType = file.mimetype || '';

  // PDF extraction
  if (extension === '.pdf' || mimeType === 'application/pdf') {
    try {
      const buffer = await fs.readFile(file.path);
      const primaryText = await extractPdfTextWithPdfParse(buffer).catch(() => ''); //yeh work nhi kar raha ha, so added fallback to pdfjs

      if (primaryText) {
        console.log('Text extracted using pdf-parse');
        return primaryText;
      }

      const fallbackText = await extractPdfTextWithPdfJs(buffer).catch(() => '');

      if (fallbackText) {
        return fallbackText;
      }

      throw new UploadValidationError('No readable text found in this PDF. It may be a scanned/image-only file. Please upload a text-based PDF or TXT file.');
    } catch (error) {
      if (error instanceof UploadValidationError) {
        throw error;
      }
      throw new UploadValidationError('Could not read this PDF file. Please upload a valid text-based PDF.');
    }
  }

  // Plain text extraction
  if (
    extension === '.txt' ||
    extension === '.csv' ||
    extension === '.json' ||
    mimeType.startsWith('text/') ||
    mimeType === 'application/json'
  ) {
    try {
      const text = await fs.readFile(file.path, 'utf8');
      return (text || '').trim();
    } catch (error) {
      throw new UploadValidationError('Could not read the uploaded text file.');
    }
  }

  throw new UploadValidationError('Unsupported file type. Please upload PDF, TXT, CSV, or JSON files only.');
}

const uploadReport = async (req, res) => {
  try {
    const { title, description, reportType, reportData: manualReportData } = req.body;
    const userId = req.user._id;
    const uploadedFile = req.file;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let reportData = (manualReportData || '').trim();
    let fileUrl;

    if (uploadedFile) {
      const extractedText = await extractTextFromFile(uploadedFile);

      if (!extractedText) {
        return res.status(400).json({
          error: 'Unable to extract text from the uploaded file. Please upload a readable PDF, TXT, CSV, or JSON file.'
        });
      }

      reportData = extractedText;
      fileUrl = `/uploads/reports/${uploadedFile.filename}`;
    }

    if (!reportData) {
      return res.status(400).json({ error: 'Report file is required' });
    }

    const report = new Report({
      userId,
      title,
      description,
      reportType,
      fileUrl,
      reportData,
      status: 'pending'
    });

    await report.save();

    res.status(201).json({
      message: 'Report uploaded successfully',
      report
    });
  } catch (error) {
    console.error('Upload report error:', error);
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to upload report' });
  }
};

const analyzeReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: reportId, userId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
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
            ${report.reportData}

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

// Get user reports
const getReports = async (req, res) => {
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

const getReport = async (req, res) => {
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

// Delete report
const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: reportId, userId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.fileUrl) {
      const filePath = path.join(__dirname, '../../', report.fileUrl.replace(/^\//, ''));
      await fs.unlink(filePath).catch(() => {
        // Ignore file deletion errors to avoid blocking DB cleanup
      });
    }

    await Report.deleteOne({ _id: reportId, userId });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadReport,
  analyzeReport,
  getReports,
  getReport,
  deleteReport
};
