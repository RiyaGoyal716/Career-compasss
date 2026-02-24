function MatchHistory() {
  const history = JSON.parse(localStorage.getItem("matchHistory")) || [];

  return (
    <div className="history-box">
      <h3>📚 Previous Matches</h3>

      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <ul>
          {history.map((item, i) => (
            <li key={i}>
              <div>
                {item.timestamp
                  ? new Date(item.timestamp).toLocaleString()
                  : "No date"}
              </div>

              {typeof item.content === "string" ? (
                <pre>{item.content.slice(0, 100)}...</pre>
              ) : typeof item.content === "object" && item.content !== null ? (
                <div>
                  <strong>Score:</strong>{" "}
                  {item.content.match_score ?? item.content.score ?? "N/A"}%
                </div>
              ) : (
                <div>Invalid Data</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MatchHistory;