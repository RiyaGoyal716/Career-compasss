from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
import pdfplumber
import io
import re

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

match_history = []

ALL_TECHNICAL_SKILLS = [
    # Languages
    "python", "javascript", "typescript", "c++", "c#", "ruby", "php", "swift", "kotlin", "java", "go", "rust", "scala", "r",
    
    # Web Development
    "react", "angular", "express", "gatsby", "fastapi", "django", "flask", "spring", "asp.net", "webpack", "svelte", "vite", "next", "html", "css", "node",
    
    # Mobile Development
    "react native", "flutter", "xamarin", "ionic",
    
    # Databases
    "postgresql", "elasticsearch", "mongodb", "mysql", "dynamodb", "cassandra", "firebase", "postgres", "redis", "sql", "oracle",
    
    # DevOps & Cloud
    "kubernetes", "terraform", "ansible", "jenkins", "gitlab", "github", "docker", "azure", "aws", "gcp", "ci/cd",
    
    # Data Science & ML
    "scikit-learn", "tensorflow", "matplotlib", "seaborn", "pytorch", "jupyter", "keras", "pandas", "numpy", "hadoop", "spark",
    
    # Tools & Platforms
    "graphql", "jira", "slack", "rest api", "linux", "windows", "git", "json", "xml", "rest", "api", "mac",
    
    # Other Common Skills
    "microservices", "integration testing", "unit testing", "automation", "performance", "testing", "agile", "scrum"
]
def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""

    try:
        pdf = PdfReader(io.BytesIO(file_bytes))
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + " "
    except Exception as e:
        pass

    if not text.strip():
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + " "
        except Exception as e:
            pass
    
    return text

def extract_skills(text: str) -> list:
    """Extract skills from text (resume or job description)"""
    text_lower = text.lower()
    found_skills = []
    
    for skill in ALL_TECHNICAL_SKILLS:
        if ' ' in skill:
            if skill in text_lower:
                found_skills.append(skill)
        else:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)

    seen = set()
    unique_skills = []
    for skill in found_skills:
        if skill not in seen:
            unique_skills.append(skill)
            seen.add(skill)
    
    return unique_skills

def generate_suggestions(match_score: int, matched_skills: list) -> list:
    suggestions = []

    # Strong profile
    if match_score >= 85:
        suggestions.append("Excellent alignment with the job role.")
        suggestions.append("You demonstrate strong technical relevance for this position.")
        suggestions.append("To stand out further, highlight measurable achievements and system-level understanding.")

    # Moderate profile
    elif match_score >= 60:
        suggestions.append("Good foundational alignment with the role requirements.")
        suggestions.append("Consider strengthening advanced-level implementations of your listed skills.")
        suggestions.append("Add real-world projects showcasing scalability and performance optimization.")

    # Low profile
    else:
        suggestions.append("Your profile shows partial alignment with this role.")
        suggestions.append("Focus on building stronger hands-on projects related to the job domain.")
        suggestions.append("Enhance technical depth and include impactful project descriptions.")

    # Universal professional improvements
    suggestions.append("Use quantified results (e.g., improved efficiency by 30%).")
    suggestions.append("Keep resume concise, achievement-oriented, and ATS-optimized.")
    suggestions.append("Add GitHub or portfolio links if not already included.")

    return suggestions

@app.post("/analyze")
async def analyze_fit(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        contents = await resume.read()
        resume_text = extract_text_from_pdf(contents)

        if not resume_text.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "Could not extract text from PDF."}
            )

        resume_skills = extract_skills(resume_text)
        required_skills = extract_skills(job_description)

        if not required_skills:
            return JSONResponse(
                status_code=400,
                content={"error": "No specific technical skills found in job description. Please include specific technologies (e.g., Python, React, Docker, AWS, etc.)"}
            )

        resume_set = set(resume_skills)
        required_set = set(required_skills)

        matched_skills = list(resume_set & required_set)
        missing_skills = list(required_set - resume_set)

        match_score = round((len(matched_skills) / len(required_skills)) * 100) if required_skills else 0

        suggestions = generate_suggestions(match_score, matched_skills)

        match_entry = {
            "resume_name": resume.filename,
            "match_score": match_score
        }

        match_history.append(match_entry)

        response_data = {
            "resume_skills": resume_skills,
            "required_skills": required_skills,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "match_score": match_score,
            "ai_feedback": suggestions,
            "match_history": match_history
        }
        
        return response_data

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})