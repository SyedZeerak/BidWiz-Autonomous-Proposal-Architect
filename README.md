# 🚀 BidWiz: The Autonomous Proposal Architect

> **Winner of the Venturethon Gen AI Challenge** (Target Goal)
>
> *From "Copy-Paste Fatigue" to "Autonomous Dealing" in 30 minutes.*

## 📄 Overview

**BidWiz** is an agentic AI solution designed to solve the "Billion-Dollar Copy-Paste Problem" in enterprise sales. It automates the response process for Request for Proposals (RFPs) and Security Questionnaires.

Instead of a simple chatbot, BidWiz is a full-stack **Autonomous Agent** that:
1.  **Ingests** complex PDF Knowledge Bases (Security Policies, Past Bids).
2.  **Reasons** using **Groq LPU (Llama 3)** and **RAG** to find exact technical answers.
3.  **Verifies** content using a "Critic Agent" loop to prevent hallucinations.
4.  **Executes** work by autonomously generating a formatted PDF report and emailing it to stakeholders.

---

## 🛠️ Tech Stack

This project uses a modern, high-performance architecture:

* **Frontend:** React (Vite), TypeScript, Lucide React
* **Backend:** Python, FastAPI, Uvicorn
* **AI Inference:** Groq LPU (Llama-3.3-70b-versatile)
* **Orchestration:** LangChain
* **Vector Store:** FAISS (Local CPU)
* **Automation:** ReportLab (PDF Generation), Python SMTP (Email Dispatch)

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16+)
* [Python](https://www.python.org/) (v3.9+)
* A Groq Cloud API Key
* A Gmail Account (for email automation features)

---

## 🔑 Environment Configuration (CRITICAL)

To make the AI and Email Automation work, you must create a `.env` file in the **backend** directory.

> **⚠️ Judges / Reviewers:** If you do not have these keys, please contact the Team Lead: **Syed Wajdan** ([clashzeerak@gmail.com](mailto:clashzeerak@gmail.com)) for a pre-configured `.env` file, or follow the steps below to generate your own.

### 1. Create the File
Create a file named `.env` in the root of the `backend` folder.

### 2. Add the Variables
Copy and paste the following into the file:

```ini
# Groq API Key for Llama 3 Inference
GROQ_API_KEY=gsk_your_groq_api_key_here

# Email Credentials for Automation
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_16_char_app_password
