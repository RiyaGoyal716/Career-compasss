import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  return (
    <div className="app">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h1>📌 Match Result:</h1>
      <div className="result">
        <pre>{result}</pre>
      </div>
      <button onClick={() => navigate("/")}>⬅️ Back to Home</button>
    </div>
  );
}

export default ResultPage;
