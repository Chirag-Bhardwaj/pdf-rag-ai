# AI-Powered PDF Q&A System  
> **Ask AI questions about any PDF using RAG (Retrieval-Augmented Generation)**  

## Features  
✅ **Extracts and indexes PDF text**  
✅ **Retrieves relevant chunks from stored PDFs**  
✅ **Uses LLaMA 3.2 (via Ollama) for answering questions**  
✅ **Fully local – No API keys, No cloud required**  
✅ **Simple Web UI using Vite (Frontend) + FastAPI (Backend)**  

---

## 🛠 Installation & Setup  

### 1️⃣ Clone This Repository  
```bash
git clone https://github.com/chirag-bhardwaj/pdf-rag.git
cd pdf-rag
```

### 2️⃣ Set Up the Backend  
#### Navigate to the Backend Directory  
```bash
cd backend
```

#### Install Backend Dependencies  
```bash
pip install -r requirements.txt
```

#### Start the Backend  
```bash
python main.py
```

---

### 3️⃣ Set Up the Frontend  
#### Navigate to the Frontend Directory  
```bash
cd ../frontend
```

#### Install Frontend Dependencies  
```bash
npm install
```

#### Start the Frontend Server  
```bash
npm run dev
```

---

## 📌 How to Use  

### 1️⃣ Upload a PDF  
- Open the frontend UI in your browser (shown in the terminal after running `npm run dev`).
- Upload a PDF file, and the system will **extract and index** the text.

### 2️⃣ Ask Questions About the PDF  
- Type any natural language question (e.g., `What is this document about?`).  
- The system will **retrieve relevant content** and generate an answer using **LLaMA**.

---

## 🛠 Requirements  
- **Python 3.10+**  
- **Ollama Installed** (for LLaMA 3.2)
- **Node.js & npm** (for frontend)
