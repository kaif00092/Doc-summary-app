import pdf from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createWorker } from "tesseract.js";

// --- AI Model Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- Main Handler ---
export const generateSummary = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file was uploaded." });
  }

  try {
    let extractedText = "";
    const fileType = req.file.mimetype;

    // --- Text Extraction Logic ---
    if (fileType === "application/pdf") {
      console.log("Processing PDF file...");
      const pdfData = await pdf(req.file.buffer);
      extractedText = pdfData.text;
    } else if (fileType.startsWith("image/")) {
      console.log("Processing image file with OCR...");
      const worker = await createWorker("eng"); // 'eng' for English
      const ret = await worker.recognize(req.file.buffer);
      extractedText = ret.data.text;
      await worker.terminate(); // Important: free up resources
    } else {
      return res.status(400).json({
        error: "Unsupported file type. Please upload a PDF or an image.",
      });
    }

    if (!extractedText) {
      return res
        .status(500)
        .json({ error: "Could not extract text from the document." });
    }

    // --- Summary Generation ---
    const { summaryLength } = req.body;
    const structuredResponse = await getSummaryFromText(
      extractedText,
      summaryLength
    );

    res.status(200).json(structuredResponse);
  } catch (error) {
    console.error("Error in summary generation:", error);
    res.status(500).json({ error: "Failed to process the document." });
  }
};

// --- Helper function to call Gemini API ---
// This avoids duplicating the API call logic for PDF and Image text.
async function getSummaryFromText(text, summaryLength) {
  const lengthInstruction = {
    short: "a single, concise paragraph",
    medium: "three distinct paragraphs",
    long: "a detailed, multi-section summary",
  };

  const prompt = `
      Analyze the following document text and provide a response in a single, clean JSON object.
      Do not include any text or markdown formatting before or after the JSON object.
      
      The JSON object must have three keys:
      1. "summary": A smart summary of the text. The summary should be ${
        lengthInstruction[summaryLength] || "of medium length"
      }.
      2. "keyPoints": An array of the most important key points as strings.
      3. "suggestions": An array of three actionable suggestions to improve the original document's clarity.

      Document Text:
      ---
      ${text}
      ---
    `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  let responseText = response.text();

  responseText = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(responseText);
}
