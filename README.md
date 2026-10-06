# Automated-Verification-of-Document-Compliance-Using-LLM-and-RAG
An AI-powered document compliance verification system that automates the analysis of academic documents using OCR, Large Language Models (LLMs), and Retrieval-Augmented Generation (RAG).

The system extracts relevant information from handwritten or scanned documents, identifies the applicable academic scheme and regulations, and verifies whether the submitted records comply with the required rules.

## 🚀 Features
📄 Document Processing – Extracts information from scanned and handwritten academic documents.
🔍 OCR-based Extraction – Extracts student details, CIE marks, academic records, and other relevant information.
🤖 LLM-powered Analysis – Uses Large Language Models for contextual document understanding and verification.
🧠 RAG-based Rule Retrieval – Retrieves relevant academic rules and regulations using vector embeddings.
🎓 Scheme Detection – Identifies the applicable academic scheme based on the student's USN.
✅ Eligibility Verification – Checks student eligibility according to applicable academic regulations.
📊 Compliance Verification – Cross-checks academic records and assignment information against defined rules.
📋 Structured Reports – Generates explainable compliance results highlighting verified information and detected inconsistencies.

## 🏗️ System Workflow
Academic Documents
        ↓
OCR / Text Extraction
        ↓
Student & Academic Information
        ↓
USN-based Scheme Detection
        ↓
RAG-based Rule Retrieval
        ↓
LLM-based Compliance Analysis
        ↓
Eligibility & Consistency Verification
        ↓
Structured Compliance Report

## 🛠️ Technologies Used
## Frontend
Next.js
React
TypeScript

## Backend
Python
Flask

## AI / ML
Large Language Models (LLM)
Retrieval-Augmented Generation (RAG)
Vector Embeddings
OCR

## Database / Retrieval
ChromaDB

## Tools
Git
GitHub
VS Code

## 📁 Project Structure
Automated-Verification-of-Document-Compliance-Using-LLM-and-RAG/
│
├── client/                 # Frontend application
│
├── server/                 # Backend and AI processing
│   ├── data/               # Local/generated data (not committed)
│   └── ...
│
├── .gitignore
├── requirements.txt
└── README.md

## 🎯 Objective

The main objective of this project is to reduce the manual effort involved in verifying academic documents by combining OCR, LLMs, and RAG to automatically extract information, retrieve relevant regulations, identify inconsistencies, and generate explainable compliance reports.

## 🔐 Data & Privacy

Uploaded documents and generated local data are excluded from version control using .gitignore. This prevents potentially sensitive academic documents and generated vector database files from being uploaded to the public repository.

👩‍💻 Author

Tejashwini K M

GitHub: @Tejashwinikm
