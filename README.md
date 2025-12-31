# 🩺 MediNodus: Your Personal AI Health Assistant

> **MediNodus** (Latin for *'Healing Knot'*) untangles the complexity of medical data. It is an intelligent mobile platform that translates complex lab reports into simple language and prevents dangerous drug interactions using real-time FDA data.

---

## 🚀 The Problem

Medical literacy is a massive barrier to healthcare in India:

1. **Complex Reports:** Patients struggle to understand lab results (e.g., *"What does high Lymphocytes mean?"*).
2. **Adverse Interactions:** Elderly patients often take multiple prescriptions without knowing if they conflict, leading to preventable hospitalizations.
3. **Illegible Prescriptions:** Handwritten notes from doctors are often unreadable by patients.

## 💡 The Solution

**MediNodus** acts as a bridge between the doctor's data and the patient's understanding.

* **📄 Report Translator:** Upload a PDF/Image of a blood test. The AI extracts values, flags abnormalities, and explains them in plain English (or Hindi).
* **💊 Drug Safety Shield:** Scan a medicine strip. The app identifies the drug and cross-references it with your *current* health profile to warn of risks (e.g., *"Don't take Ibuprofen; your Kidney function is low"*).
* **✍️ Prescription Decoder:** Uses a fine-tuned Vision Transformer (TrOCR) to read doctor handwriting.

---

## 🏗️ System Architecture

The system follows a microservices-ready architecture, containerized with Docker for instant scalability.

**(Insert your Mermaid Architecture Diagram here)**

---

## 🛠️ Tech Stack

| Component | Technology | Role |
| --- | --- | --- |
| **Mobile App** | React Native (Expo), TypeScript | Cross-platform UI, Camera handling, Offline-first architecture. |
| **Backend API** | FastAPI (Python 3.10+) | High-performance async API, Business logic. |
| **Database** | MongoDB Atlas, Beanie ODM | Storing unstructured medical reports & user profiles. |
| **AI - Reasoning** | Google Gemini Pro, LangChain | RAG pipeline for medical summarization & safety checks. |
| **AI - Vision** | PaddleOCR, TrOCR, OpenCV | Extracting text from lab reports & handwritten prescriptions. |
| **Data Source** | OpenFDA API | Real-time, authoritative drug labeling & interaction data. |
| **DevOps** | Docker, GitHub Actions | Containerization and CI/CD pipelines. |

---

## ✨ Key Features

### 1. 📊 Smart Report Analysis

* **OCR Pipeline:** Extracts data tables from messy scanned PDFs using PaddleOCR.
* **Medical RAG:** Explains medical jargon using an LLM grounded in factual context (reducing hallucinations).
* **Trend Tracking:** Visualizes how your health markers (e.g., Sugar, Iron) change over time.

### 2. 🛡️ Context-Aware Drug Safety

* **Personalized Warnings:** Doesn't just list side effects; checks if *YOU* are at risk based on your upload history.
* **Interaction Checker:** Detects Drug-Drug and Drug-Disease conflicts.

### 3. 📝 Prescription Digitization (Beta)

* Uses a **Transformer-based OCR (TrOCR)** fine-tuned on medical handwriting datasets to digitize doctor notes.

---

## ⚡ Getting Started

### Prerequisites

* Node.js & npm
* Python 3.10+
* Docker & Docker Compose
* MongoDB Atlas URI

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/medinodus.git
cd medinodus

```

### 2. Backend Setup (FastAPI)

```bash
cd backend
# Create .env file
cp .env.example .env 
# Run with Docker (Recommended)
docker-compose up --build

```

*The API will be live at `http://localhost:8000*`

### 3. Mobile Setup (React Native)

```bash
cd mobile
npm install
npx expo start

```

*Scan the QR code with the Expo Go app to run on your phone.*

---

## 🧪 Testing & Quality

We prioritize engineering excellence.

* **Backend Tests:** Run `pytest` to execute 50+ unit tests ensuring API stability.
* **Load Testing:** Validated with **Locust** to handle 500+ concurrent requests/sec.

## 🤝 Team

* **Member 1:** Android/React Native Engineering
* **Member 2:** Backend Systems & Database Architecture
* **Member 3:** AI/ML Pipelines & RAG Strategy

---

### 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
