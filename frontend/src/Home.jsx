import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import DarkModeToggle from "./components/DarkModeToggle";
import "./index.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function Home() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  // Load Lottie animation
  useEffect(() => {
    fetch("/lottie/analyzing.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation", err));
  }, []);

  const handleAnalyze = async () => {
    setError("");

    if (!file) {
      setError("Please upload your resume (PDF or TXT format)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB. Please upload a smaller file.");
      setFile(null);
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the job description");
      return;
    }

    if (jobDescription.length < 50) {
      setError("Job description seems too short. Please paste the complete job description.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
     const response = await fetch("https://career-compass-backend-p28z.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Analysis failed. Please try again.");
        return;
      }

      const result = await response.json();
      const existing = JSON.parse(localStorage.getItem("matchHistory")) || [];
      const updated = [
        { content: result, timestamp: new Date().toISOString() },
        ...existing.slice(0, 4),
      ];
      localStorage.setItem("matchHistory", JSON.stringify(updated));

      navigate("/result", { state: { result } });
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.name.match(/\.(pdf|txt)$/i)) {
        setError("Please upload a PDF or TXT file.");
        return;
      }
      setFile(droppedFile);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(pdf|txt)$/i)) {
        setError("Please upload a PDF or TXT file.");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  return (
    <div className="home-wrapper">
      <DarkModeToggle />
      <div className="home-card">
        <img src="/logo.png" alt="Career Compass Logo" className="home-logo" />
        <h1 className="home-heading">Career Compass</h1>
        <p className="home-subheading">Smart resume & job fit analyzer</p>

        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
        >
          {file ? (
            <p>📄 {file.name}</p>
          ) : (
            <p>📂 Drag your resume here or click to browse</p>
          )}
        </div>

        <input
          type="file"
          accept=".pdf,.txt"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="home-input"
          style={{ display: "none" }}
        />

        {error && (
          <div style={{
            padding: "12px",
            marginBottom: "1rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <textarea
          className="home-textarea"
          placeholder="Paste the complete job description here..."
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isLoading || !file || !jobDescription.trim()}
        >
          {isLoading ? "🚀 Analyzing..." : "🎯 Analyze Fit"}
        </button>

        {isLoading && animationData && (
          <div className="lottie-container">
            <Lottie animationData={animationData} loop autoplay />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
