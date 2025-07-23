import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Callback from "./pages/Callback";
import { ToastContainer } from "react-toastify";
import Mood from "./pages/Mood";
import Navbar from "./components/Navbar";
import { generateAuthUrl } from "./utils/generateAuthUrl";
import { useEffect, useState } from "react";
import Tournament from "./pages/Tournament";

function App() {
  const [authUrl, setAuthUrl] = useState<string>("");

  useEffect(() => {
    generateAuthUrl().then(setAuthUrl);
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
        <Navbar authUrl={authUrl} />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
