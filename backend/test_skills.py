#!/usr/bin/env python
import re

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

def extract_skills(text):
    """Extract skills from text (resume or job description)"""
    text_lower = text.lower()
    found_skills = []
    
    for skill in ALL_TECHNICAL_SKILLS:
        # For multi-word skills, just check if they exist as substring
        # For single-word skills, use word boundaries
        if ' ' in skill:
            # Multi-word skill - use simple substring match
            if skill in text_lower:
                found_skills.append(skill)
        else:
            # Single-word skill - use word boundaries
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_skills = []
    for skill in found_skills:
        if skill not in seen:
            unique_skills.append(skill)
            seen.add(skill)
    
    return unique_skills

# Test
resume_text = """
Senior Software Developer with 5 years of experience in Python, JavaScript, and React.
Proficient in Django, FastAPI, and Node.js backends.
Database experience includes MongoDB, SQL, and PostgreSQL.
DevOps: Docker, Kubernetes, AWS, and Jenkins.
Tools: Git, Linux, VS Code
"""

job_description = """
We are looking for a Full Stack Developer with:
- Python and JavaScript expertise
- React and Node.js experience  
- SQL and MongoDB knowledge
- Docker and Kubernetes skills
- AWS deployment experience
"""

resume_skills = extract_skills(resume_text)
job_skills = extract_skills(job_description)
matched = set(resume_skills) & set(job_skills)

print(f"Resume skills: {resume_skills}")
print(f"Job skills: {job_skills}")
print(f"Matched: {matched}")
print(f"Match percentage: {len(matched)/len(job_skills)*100}%")
