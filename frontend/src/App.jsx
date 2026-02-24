import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import MatchResult from "./components/MatchResult";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<MatchResult />} />
    </Routes>
  );
}

export default App;
