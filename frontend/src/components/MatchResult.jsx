import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import MatchHistory from "./MatchHistory";
import SkillMatchChart from "./SkillMatchChart";

function MatchResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  const result = location.state?.result || {};
  const matchScore = result.match_score || 0;
  const matchedSkills = result.matched_skills || [];
  const missingSkills = result.missing_skills || [];
  const aiFeedback = result.ai_feedback || [];

  const skillCategories = {
    'Frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'bootstrap', 'next'],
    'Backend': ['node', 'python', 'java', 'c#', 'php', 'go', 'rust', 'fastapi', 'express', 'django'],
    'Database': ['sql', 'mongodb', 'postgresql', 'mysql', 'firebase', 'dynamodb', 'redis', 'elasticsearch'],
    'Tools & DevOps': ['git', 'docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'github', 'gitlab', 'terraform']
  };

  const categorizeSkills = (skills) => {
    const categorized = {};
    const uncategorized = [];

    skills.forEach(skill => {
      let found = false;
      for (const [category, keywords] of Object.entries(skillCategories)) {
        if (keywords.some(keyword => skill.toLowerCase().includes(keyword))) {
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push(skill);
          found = true;
          break;
        }
      }
      if (!found) uncategorized.push(skill);
    });

    if (uncategorized.length > 0) {
      categorized['Other'] = uncategorized;
    }

    return categorized;
  };

  const categorizedSkills = categorizeSkills(matchedSkills);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 15;

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("Career Compass - Match Analysis Report", 15, yPos);
    yPos += 12;

    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, 195, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.setTextColor(6, 182, 212);
    doc.setFont(undefined, 'bold');
    doc.text(`Match Score: ${matchScore}%`, 15, yPos);
    yPos += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Matched Skills", 15, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    if (matchedSkills.length > 0) {
      const skillsText = matchedSkills.join(", ");
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      skillsLines.forEach((line) => {
        doc.text(line, 15, yPos);
        yPos += 5;
      });
    } else {
      doc.text("No matched skills", 15, yPos);
      yPos += 5;
    }
    yPos += 5;

    if (missingSkills.length > 0) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Skills to Develop", 15, yPos);
      yPos += 6;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const missingText = missingSkills.join(", ");
      const missingLines = doc.splitTextToSize(missingText, 170);
      missingLines.forEach((line) => {
        doc.text(line, 15, yPos);
        yPos += 5;
      });
      yPos += 5;
    }

    if (aiFeedback.length > 0) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Recommendations", 15, yPos);
      yPos += 6;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      aiFeedback.slice(0, 5).forEach((feedback, idx) => {
        const feedbackLines = doc.splitTextToSize(`${idx + 1}. ${feedback}`, 170);
        feedbackLines.forEach((line) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 15;
          }
          doc.text(line, 15, yPos);
          yPos += 5;
        });
        yPos += 2;
      });
    }

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString()} - Career Compass`, 15, 285);

    doc.save(`match-analysis-${new Date().getTime()}.pdf`);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const chartSkills = [
    ...matchedSkills.map(skill => ({ name: skill, value: 100 }))
  ];

  return (
    <div className="app">
      <div className="sticky-header">
        <img src="/logo.png" alt="Career Compass Logo" className="logo" />
        <h1>Match Analysis</h1>
      </div>

      <div className="result-layout">

        <div className="left-column">

          <div className="result-card">
            <h2>📋 Match Result</h2>
            <h2>📌 Analysis</h2>

            <div className="match-score">
              {matchScore}%
            </div>
            <div className="score-label">Overall Match</div>

            <div className="skills-section">
              <h3>✅ Matched Skills ({matchedSkills.length})</h3>
              {matchedSkills.length > 0 ? (
                <div>
                  {Object.entries(categorizedSkills).map(([category, skills]) => (
                    <div key={category} className="skill-category">
                      <div className="skill-category-name">{category}</div>
                      <div className="skill-category-list">
                        {skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag matched">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">∅</div>
                  <p className="empty-state-text">No matched skills</p>
                  <p className="empty-state-subtext">Try uploading a resume with relevant skills</p>
                </div>
              )}
            </div>

            {missingSkills.length > 0 && (
              <div className="skills-section">
                <h3>❌ Skills to Develop ({missingSkills.length})</h3>
                <div className="skill-category">
                  <div className="skill-category-list">
                    {missingSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag missing">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="recommendations-section">
              <h3>💡 Recommendations</h3>
              {aiFeedback.length > 0 ? (
                <div className="recommendations-list">
                  {aiFeedback.map((recommendation, idx) => (
                    <div key={idx} className="recommendation-item">
                      <span className="recommendation-icon">→</span>
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">—</div>
                  <p className="empty-state-text">Perfect match</p>
                  <p className="empty-state-subtext">Your profile aligns well with this role</p>
                </div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <h2>📈 Skill Distribution</h2>
            {matchedSkills.length > 0 ? (
              <SkillMatchChart skills={chartSkills} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">—</div>
                <p className="empty-state-text">No skills to visualize</p>
                <p className="empty-state-subtext">Chart appears when skills are matched</p>
              </div>
            )}
          </div>

        </div>

        <div className="right-column">
          <div className="result-card">
            <h2>📊 Skill Match Overview</h2>
            <MatchHistory />
          </div>
        </div>

      </div>

      <div className="button-row">
        <button className="pdf-button" onClick={downloadPDF}>📥 Download PDF</button>
        <button className="pdf-button" onClick={() => navigate("/")}>🔄 Back to Home</button>
        <button className="pdf-button" onClick={() => setIsDark(!isDark)}>
          {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
}

export default MatchResult;