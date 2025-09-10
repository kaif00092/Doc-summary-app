import React from "react";

const SummaryDisplay = ({ data }) => {
  if (!data) return null;

  return (
    <div className="summary-container">
      <h2>Summary</h2>
      <p>
        {typeof data.summary === "string"
          ? data.summary
          : JSON.stringify(data.summary)}
      </p>

      <h2>Key Points</h2>
      <ul>
        {data.keyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>

      <h2>Improvement Suggestions</h2>
      <ul>
        {data.suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryDisplay;
