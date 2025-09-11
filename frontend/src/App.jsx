import React, { useState } from "react";
import axios from "axios";
import DocumentUpload from "./components/DocumentUpload";
import SummaryDisplay from "./components/SummaryDisplay";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSummaryData(null);
    setError("");
  };

  const handleSummarize = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setSummaryData(null);

    const formData = new FormData();
    formData.append("document", file);
    formData.append("summaryLength", summaryLength);

    try {
      const BASE_URL =
        import.meta.env.MODE === "development"
          ? "http://localhost:3030/api/summarize"
          : "/api/summarize";
      const response = await axios.post(BASE_URL, formData);
      setSummaryData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const summaryOptions = ["short", "medium", "long"];

  return (
    <div className="app-container">
      <h1>Document Summary Assistant</h1>

      <div className="card">
        <DocumentUpload
          onFileSelect={handleFileSelect}
          file={file}
          disabled={loading}
        />
        <hr />
        <div className="summary-length-container">
          <h3>Summary Length</h3>
          <div className="radio-group">
            {summaryOptions.map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  id={option}
                  name="summaryLength"
                  value={option}
                  checked={summaryLength === option}
                  onChange={(e) => setSummaryLength(e.target.value)}
                  disabled={loading}
                  className="radio-input"
                />
                <label htmlFor={option} className="radio-label">
                  <div className="radio-button-outer">
                    <div className="radio-button-inner"></div>
                  </div>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSummarize}
          disabled={!file || loading}
          className="generate-button"
        >
          Generate Summary
        </button>
      </div>

      <div className="status-messages">
        {!loading && !error && !summaryData && (
          <p className="footer-text">Upload a document to get started.</p>
        )}
        {loading && (
          <p className="loading-message">Analyzing your document...</p>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>

      {summaryData && <SummaryDisplay data={summaryData} />}
    </div>
  );
}

export default App;
