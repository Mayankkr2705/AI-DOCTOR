const Report = require('../models/Report');
const axios = require('axios');

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

const uploadReport = async (req, res) => {
  try {
    const { title, description, reportType, reportData } = req.body;
    const userId = req.user._id;

    if (!title || !reportData) {
      return res.status(400).json({ error: 'Title and report data are required' });
    }

    const report = new Report({
      userId,
      title,
      description,
      reportType,
      reportData,
      status: 'pending'
    });

    await report.save();

    res.status(201).json({
      message: 'Report uploaded successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const result = await Report.deleteOne({ _id: reportId, userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

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
