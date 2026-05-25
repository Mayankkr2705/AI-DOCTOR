# Medical AI Chatbot

A comprehensive medical AI assistant with Groq-powered chat, report analysis, health scoring, and health news.

## Features

### Backend
- **Authentication System**: User registration and login with JWT
- **AI Chatbot**: Powered by **Groq** with 4 specialized modes:
  - Pediatric Care (Child Doctor)
  - Adult Healthcare
  - Women's Health
  - Veterinary Care
- **Medical Report Analysis**: Upload and analyze medical reports with AI (PDF/TXT/CSV/JSON)
- **Health Score Analysis**: Submit basic health form and get AI-assisted score + recommendations
- **Health News**: Get latest medical and health news
- **MongoDB Database**: Store user data, chat history, and reports

### Frontend
- **Landing Page**: Beautiful homepage with feature showcase
- **Authentication**: Sign in and sign up pages
- **Dashboard**: Central hub for all features
- **Health Assessment Form**: Calculate and store user health score with AI insight
- **AI Chatbot Interface**: Interactive chat with mode selection
- **Report Management**: Upload report files, view extracted text, and analyze reports
- **News Feed**: Browse and search health news
- **Responsive Design**: Works on all devices

## Tech Stack

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Groq API
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router
- Axios
- Lucide React (icons)
- Tailwind CSS (add via PostCSS)
- Vite

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Groq API Key ([Get it here](https://console.groq.com/keys))
- News API Key (optional - [Get it here](https://newsapi.org/))

### Backend Setup

1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medical-ai-chatbot
   JWT_SECRET=your_secure_secret_key_here
   GROQ_API_KEY=your_groq_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend folder:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## Usage

1. **Register an Account**: Go to the Sign Up page and create an account
2. **Sign In**: Log in with your credentials
3. **Dashboard**: Explore the dashboard with quick access to all features
4. **Use AI Chatbot**: 
   - Select a consultation mode (Pediatric, Adult, Women's Health, or Veterinary)
   - Start chatting with the AI assistant
5. **Upload Reports**:
   - Go to Reports page
   - Upload report file (`.pdf`, `.txt`, `.csv`, `.json`)
   - Click "Analyze" to get AI-powered insights
6. **Run Health Assessment**:
   - Open Dashboard
   - Click **Take/Retake Assessment** on health card
   - Submit basic health form to get score and recommendations
7. **Browse News**: Check the latest health and medical news

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Chatbot
- `POST /api/chatbot/chat` - Send message to AI
- `POST /api/chatbot/health-score` - Analyze health form and return score
- `GET /api/chatbot/history` - Get all conversations
- `GET /api/chatbot/history/:id` - Get specific conversation
- `DELETE /api/chatbot/history/:id` - Delete conversation

### Reports
- `POST /api/reports/upload` - Upload new report
- `POST /api/reports/:id/analyze` - Analyze report with AI
- `GET /api/reports` - Get all user reports
- `GET /api/reports/:id` - Get specific report
- `DELETE /api/reports/:id` - Delete report

### News
- `GET /api/news` - Get health news
- `GET /api/news/search?query=...` - Search news

## Important Notes

⚠️ **Medical Disclaimer**: This AI chatbot is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## Future Enhancements

- **Clinic & Doctor Directory:** Integrated database of local doctors, clinics, and hospitals containing verified physical addresses, specialty areas, consulting hours, and phone numbers.
- **Symptom-Based Clinic Locator:** Automatically match symptom analysis outcomes from chats with nearby medical centers or specific clinical departments.
- **Direct Clinic Contact & Scheduling:** Direct dial links and embedded messaging cards to contact local clinics instantly.
- **OCR Support:** Optical Character Recognition (OCR) support for scanned, image-only PDF reports and diagnostic photos.
- **Voice Consultation:** Voice-to-text input and natural-sounding text-to-speech feedback for the AI chatbot interfaces.
- **Prescription & Refill Tracking:** Safe indexing of electronic prescriptions with medication refill reminders and pharmacy forwarding.
- **Dosage & Vaccine Reminders:** Automated push/SMS reminders for prescription schedules, check-up follow-ups, and pediatric vaccination plans.
- **Wearable Device Integration:** Live syncing of health score metrics with smartwatches and fitness bands (Apple HealthKit, Google Fit).
- **Video Consultation Booking:** Secure, end-to-end encrypted telehealth video consultation sessions with specialists.

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub or contact support.
