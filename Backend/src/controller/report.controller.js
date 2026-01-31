const Report = require('../models/Report');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    // Generate AI analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
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

    const result = await model.generateContent(prompt);
    const analysisText = result.response.text();

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

// Helper function to extract bullet points
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

// Get single report
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
