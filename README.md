# 🎯 Career Compass – AI Resume & Job Match Analyzer

Career Compass is a full-stack AI web application that analyzes how well a candidate’s resume matches a given job description.  
It extracts skills from both documents, calculates a match score, identifies missing skills, and provides actionable AI feedback to improve job readiness.

---

## 🌐 Live Demo

Live App:  https://career-compasss-olive.vercel.app/

Backend API: https://career-compass-backend-p28z.onrender.com

API Docs: https://career-compass-backend-p28z.onrender.com/docs

---

## ✨ Key Highlights

- AI-powered resume vs job description analysis  
- Skill extraction from PDF/TXT resumes  
- Match score and missing skills detection  
- Visual skill match chart  
- AI feedback for resume improvement  
- Result history (last 5 analyses)  
- PDF export of results  
- Dark mode modern UI  
- Drag & drop resume upload  
- Fully deployed full-stack system  

---

## 🚀 Features

- Upload resume (.pdf / .txt)  
- Paste job description  
- One-click AI analysis  
- Resume & JD skill extraction  
- Match score calculation  
- Matched vs missing skills  
- Radar skill visualization  
- AI suggestions & feedback  
- Local match history  
- Download analysis as PDF  
- Dark / Light mode  
- Animated loading  

---

## 🧠 How It Works

1. User uploads resume and job description  
2. Frontend sends data to FastAPI backend  
3. Backend extracts text from resume  
4. Skills parsed using NLP and keyword matching  
5. Match score and gaps calculated  
6. AI generates improvement feedback  
7. Results displayed with charts  

---

## 🛠️ Tech Stack

Frontend  
React + Vite  
TailwindCSS  
Chart.js  
Lottie  
html2canvas  
jsPDF  

Backend  
FastAPI (Python)  
PyPDF2  
pdfplumber  
Regex parsers  
CORS  

AI / NLP  
Skill extraction  
Keyword matching  
Resume-JD scoring  
AI feedback generation  

---

## 📂 Project Structure

career-compass/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/lottie/
│   └── src/
│       ├── components/
│       ├── App.jsx
│       ├── Home.jsx
│       └── MatchResult.jsx
│
└── README.md

---

## 🌐 Deployment

Frontend: Vercel  
Backend: Render  

Architecture:

User → Vercel (React UI) → Render (FastAPI API) → Analysis → Result  

---

## 🔧 Run Locally

Backend

cd backend  
pip install -r requirements.txt  
uvicorn main:app --reload  

API endpoint:  
http://127.0.0.1:8000/analyze  

Frontend

cd frontend  
npm install  
npm run dev  

App:  
http://localhost:5173  

---

## 📊 Example Output

- Resume skills extracted  
- Job skills detected  
- Match score (%)  
- Missing skills  
- AI feedback  
- Skill radar chart  

---

## 🎓 Use Cases

- Students improving resumes  
- Job seekers targeting roles  
- Placement preparation  
- Career counseling  
- Resume optimization  

---

## 👩‍💻 Author

Riya Goyal  
Computer Science Student  

GitHub: https://github.com/goyalriya716  

---

## 📜 License

Educational and demo use only.

---

## ⭐ Support

If you like this project, please star the repository.
