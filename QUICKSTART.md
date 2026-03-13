# Quick Start Guide - Medical AI Chatbot

## Prerequisites
✅ Node.js (v18+) installed
✅ MongoDB installed/running OR MongoDB Atlas account
✅ Groq API Key ([Get here](https://console.groq.com/keys))

## Installation (5 minutes)

### Step 1: Install Dependencies
**Option A - Automated (Windows):**
```bash
setup.bat
```

**Option B - Manual:**
```bash
# Backend
cd Backend
npm install

# Frontend  
cd ../Frontend
npm install
npm install -D tailwindcss postcss autoprefixer
```

### Step 2: Configure Backend
1. Copy `Backend/.env.example` to `Backend/.env`
2. Edit `Backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-ai-chatbot
JWT_SECRET=my_super_secret_key_12345
GROQ_API_KEY=YOUR_GROQ_API_KEY_HERE
NEWS_API_KEY=optional_news_api_key
```

**Get API Keys:**
- Groq API: https://console.groq.com/keys
- News API: https://newsapi.org/register (FREE, optional)

### Step 3: Start MongoDB
**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (update MONGODB_URI in .env)

### Step 4: Start Servers

**Option A - Automated (Windows):**
```bash
start.bat
```

**Option B - Manual:**
```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

## Access the Application
🌐 Frontend: http://localhost:5173
🔌 Backend API: http://localhost:5000

## First Time Usage

### 1. Create Account
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123

### 2. Try the AI Chatbot
1. Login with your account
2. Go to "AI Chatbot"
3. Select a mode (Adult, Child, Female, or Animal)
4. Ask: "What are the symptoms of flu?"

### 3. Upload a Sample Report
1. Go to "Reports"
2. Click "Upload Report"
3. Fill in title/type and upload file (`.pdf`, `.txt`, `.csv`, `.json`)
4. Click "Upload Report"
5. Click "Analyze" to get AI insights

### 4. Test Health Score Assessment
1. Go to Dashboard
2. In "Health Score", click "Take Health Assessment"
3. Fill basic health questions (sleep, exercise, stress, etc.)
4. Submit to get AI-analyzed health score
5. Click heart icon on health card to view insight/recommendations

### 5. Browse Health News
1. Go to "Health News"
2. Browse articles or search for topics

## Test Scenarios

### Pediatric Mode Test
```
Select: Pediatric Care mode
Ask: "My 5-year old has a fever of 101°F. What should I do?"
```

### Women's Health Test
```
Select: Women's Health mode
Ask: "What are common symptoms of PCOS?"
```

### Veterinary Test
```
Select: Veterinary Care mode
Ask: "My dog is not eating. What could be wrong?"
```

## Common Issues & Solutions

### ❌ "Cannot connect to MongoDB"
**Solution:**
- Start MongoDB: `mongod`
- Or use MongoDB Atlas connection string

### ❌ "Failed to generate AI response"
**Solution:**
- Check GROQ_API_KEY in Backend/.env
- Verify internet connection
- Get API key: https://console.groq.com/keys

### ❌ "Port 5000 already in use"
**Solution:**
- Change PORT in Backend/.env to 5001
- Update API_URL in Frontend/src/services/api.js

### ❌ Frontend shows blank page
**Solution:**
- Open browser console (F12)
- Check for errors
- Verify backend is running
- Clear browser cache

### ❌ "Login failed" or "Token invalid"
**Solution:**
- Clear localStorage in browser (F12 > Application > Local Storage)
- Check JWT_SECRET is set in .env
- Re-register a new account

## Development Tips

### Backend Hot Reload
```bash
cd Backend
npm run dev  # Uses nodemon for auto-restart
```

### View Logs
- Backend: Check terminal where `npm run dev` is running
- Frontend: Open browser DevTools (F12) > Console

### Test API Directly
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### Database Management
```bash
# Connect to MongoDB
mongosh

# View database
use medical-ai-chatbot

# View users
db.users.find()

# View chat history
db.chathistories.find()
```

## Environment Variables Explained

### Backend/.env
```env
# Server port
PORT=5000

# Database connection
MONGODB_URI=mongodb://localhost:27017/medical-ai-chatbot
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT secret for authentication (use strong random string)
JWT_SECRET=change_this_to_random_string_in_production

# Groq API for chatbot/report/health analysis (REQUIRED)
GROQ_API_KEY=your_key_here

# News API for health news (OPTIONAL - mock data available)
NEWS_API_KEY=your_news_api_key
```

## Project Structure Quick Reference

```
Backend/
├── src/
│   ├── controller/     # Business logic
│   ├── middleware/     # Auth & validation
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point

Frontend/
├── src/
│   ├── components/     # Reusable UI
│   ├── context/        # Global state
│   ├── pages/          # Route pages
│   ├── services/       # API calls
│   └── App.jsx         # Main app
```

## Next Steps

1. ✅ Create an account and login
2. ✅ Test all 4 chatbot modes
3. ✅ Upload and analyze a sample report
4. ✅ Browse health news
5. 📚 Read PROJECT_SUMMARY.md for detailed info
6. 🚀 Customize and extend features

## Support

**Issues?**
- Check troubleshooting section above
- Review backend logs
- Check browser console (F12)
- Verify all environment variables are set

**Need Help?**
- Read README.md for detailed setup
- Check PROJECT_SUMMARY.md for architecture
- Review API endpoints documentation

## Security Reminder

⚠️ **For Production:**
- Change JWT_SECRET to strong random string
- Use MongoDB Atlas with authentication
- Enable HTTPS
- Add rate limiting
- Implement proper error handling
- Never commit .env file

## Medical Disclaimer

⚠️ This AI chatbot is for **educational purposes only**. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.

---

**Happy Coding! 🎉**

Questions? Check the documentation or create an issue.
