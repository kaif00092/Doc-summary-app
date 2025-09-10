import pdf from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createWorker } from "tesseract.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateSummary = async (req, res) => {
  console.log("--- STEP 1: Request received on backend. ---");

  if (!req.file) {
    console.error("Error: No file found in request.");
    return res.status(400).json({ error: "No file was uploaded." });
  }
  console.log(
    `File received: ${req.file.originalname}, Type: ${req.file.mimetype}`
  );

  try {
    let extractedText = "";
    const fileType = req.file.mimetype;

    if (fileType === "application/pdf") {
      console.log("--- STEP 2: Processing PDF file... ---");
      const pdfData = await pdf(req.file.buffer);
      extractedText = pdfData.text;
    } else if (fileType.startsWith("image/")) {
      console.log("--- STEP 2: Processing image file with OCR... ---");
      const worker = await createWorker("eng");
      const ret = await worker.recognize(req.file.buffer);
      extractedText = ret.data.text;
      await worker.terminate();
    } else {
      console.error(`Error: Unsupported file type: ${fileType}`);
      return res.status(400).json({ error: "Unsupported file type." });
    }

    if (!extractedText) {
      console.error("Error: Text extraction resulted in empty string.");
      return res
        .status(500)
        .json({ error: "Could not extract text from the document." });
    }
    console.log("--- STEP 3: Text extracted successfully. ---");
    // console.log("Extracted Text Snippet:", extractedText.substring(0, 100)); // Optional: to see the text

    const { summaryLength } = req.body;
    console.log(
      `--- STEP 4: Requesting summary from AI. Length: ${summaryLength} ---`
    );
    const structuredResponse = await getSummaryFromText(
      extractedText,
      summaryLength
    );

    console.log("--- STEP 5: AI response received. Sending to frontend. ---");
    res.status(200).json(structuredResponse);
  } catch (error) {
    console.error("--- CATCH BLOCK ERROR ---:", error);
    res.status(500).json({ error: "Failed to process the document." });
  }
};

async function getSummaryFromText(text, summaryLength) {
  // ... (The getSummaryFromText function remains the same)
  const lengthInstruction = {
    short: "a single, concise paragraph",
    medium: "three distinct paragraphs",
    long: "a detailed, multi-section summary",
  };
  const prompt = `
      Analyze the following document text and provide a response in a single, clean JSON object.
      Do not include any text or markdown formatting before or after the JSON object.
      The JSON object must have three keys: "summary", "keyPoints", and "suggestions".
      Document Text: --- ${text} ---
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
