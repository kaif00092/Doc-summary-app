

# 📄Document Summarizer

A full-stack web application that uses Google's Gemini API to generate concise, intelligent summaries of uploaded documents. This project features a modern React frontend and a robust Node.js backend.

<img width="833" height="891" alt="Screenshot 2025-09-11 132742" src="https://github.com/user-attachments/assets/132c17c4-c7e9-4a1a-b499-9627157c639f" />

---

## ✨ Features

- **Secure File Uploads**: Upload documents (`.pdf`, `.docx`, `.txt`) to be summarized.
- **AI-Powered Summarization**: Leverages the power of **Google's Gemini API** to provide high-quality, abstractive summaries.
- **Responsive UI**: A clean and modern user interface built with React that works seamlessly on all devices.
- **Streamed Responses**: Displays the summary as it's being generated for an improved user experience.

***

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS3
- **Backend**: Node.js, Express
- **AI Service**: Google Gemini API
- **Deployment**: Render (Web Service + Static Site)

***

## ⚙️ Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### 1. Clone the Repository

First, clone the project from GitHub:
```bash
git clone [https://github.com/kaif00092/Doc-summary-app.git](https://github.com/kaif00092/Doc-summary-app/.git)
cd Doc-summary-app

```
### 2. Set Up Environment Variables
This project requires API keys and environment-specific configurations.

**Backend (backend/)**: Create a file named .env inside the server directory.

**backend/.env**
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
PORT=3030
You can get your GEMINI_API_KEY from Google AI Studio.

### Install Dependencies
This is a monorepo with separate dependencies for the client and server.

### Install server/backend dependencies:
```
cd backend
npm install
```
### Install client dependencies:

```

cd frontend
npm install
```
### Run the Application
You'll need to run the frontend and backend in separate terminals.

Run the backend server:

# In /backend
```
npm run dev
```
The API should now be running on http://localhost:3030.

Run the frontend client (from the client directory):

# In /client
```
npm run dev
```
The React app should now be accessible at http://localhost:5173.

### 🚀 Deployment
This application is configured for deployment on Render.
