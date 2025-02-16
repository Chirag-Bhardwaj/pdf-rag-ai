# 📜 AI-Powered PDF Q&A System  
> **Ask AI questions about any PDF using RAG (Retrieval-Augmented Generation)**  

## 🚀 Features  
✅ **Extracts and indexes PDF text**  
✅ **Retrieves relevant chunks from stored PDFs**  
✅ **Uses LLaMA 3.2 (via Ollama) for answering questions**  
✅ **Fully local – No API keys, No cloud required**  
✅ **Simple CLI interface for now (Future Web UI planned)**  

---

## 🛠 Installation & Setup  

### 1️⃣ Clone This Repository  
```bash
git clone https://github.com/chirag-bhardwaj/pdf-rag.git
cd pdf-rag
```

### 2️⃣ Create a Virtual Environment  
#### For macOS/Linux  
```bash
python -m venv venv
source venv/bin/activate
```
#### For Windows  
```bash
python -m venv venv
venv\Scripts\activate
```

### 3️⃣ Install Dependencies  
```bash
pip install -r requirements.txt
```

### 4️⃣ Install Ollama (for LLaMA 3.2 model)  
#### For macOS  
```bash
brew install ollama
```
#### For Linux  
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 5️⃣ Pull LLaMA 3.2 Model  
```bash
ollama pull llama3.2:latest
```

---

## 📌 How to use  

### 1️⃣ Start the PDF Q&A System  
```bash
python pdf_qa.py
```

### 2️⃣ Upload a PDF  
- When prompted, **enter the path** to your PDF.  
- The system will **extract and index** the text from the PDF.

### 3️⃣ Ask Questions About the PDF  
- **Type any natural language question** (e.g., `What is this document about?`).  
- The system will **retrieve relevant content** and ask **LLaMA** for an answer.

---

## 🛠 Requirements  
- **Python 3.10+**  
- **Ollama Installed** (for LLaMA 3.2)  
- **FAISS or ChromaDB** (for fast text retrieval)  
