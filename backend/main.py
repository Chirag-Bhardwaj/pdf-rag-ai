from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import subprocess
from pypdf import PdfReader
import tempfile

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store PDF contents in memory
pdf_contents = {}

OLLAMA_MODEL = "llama3.2:latest"

class QuestionRequest(BaseModel):
    question: str
    pdf_id: str

def extract_text_from_pdf(pdf_path):
    """Extracts and returns text from a given PDF file."""
    reader = PdfReader(pdf_path)
    text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
    return text

def ask_question(context, question):
    """Sends a question to the LLaMA model using Ollama and returns the response."""
    prompt = f"Context: {context}\n\nQuestion: {question}\nAnswer:"
    try:
        result = subprocess.run(
            ["ollama", "run", OLLAMA_MODEL, prompt],
            capture_output=True,
            text=True
        )
        return result.stdout.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running Ollama: {e}")

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Create a temporary file to store the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file.flush()
            
            # Extract text from the PDF
            pdf_text = extract_text_from_pdf(tmp_file.name)
            
            # Generate a unique ID for this PDF
            pdf_id = str(hash(pdf_text))[:10]
            
            # Store the PDF text
            pdf_contents[pdf_id] = pdf_text
            
        # Clean up the temporary file
        os.unlink(tmp_file.name)
        
        return {"pdf_id": pdf_id, "message": "PDF uploaded successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {e}")

@app.post("/api/ask")
async def ask(request: QuestionRequest):
    if request.pdf_id not in pdf_contents:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    try:
        context = pdf_contents[request.pdf_id]
        answer = ask_question(context, request.question)
        return {"answer": answer}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
