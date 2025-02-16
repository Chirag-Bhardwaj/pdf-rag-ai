import React, { useState, useRef } from 'react';
import { Upload, X, Send, Loader2, FileText } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const PdfQA = () => {
  const [pdfName, setPdfName] = useState('');
  const [pdfId, setPdfId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      handleFileSelect(file);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleFileSelect = async (file) => {
    setError('');
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload PDF');
      }

      const data = await response.json();
      setPdfId(data.pdf_id);
      setPdfName(file.name);
      setMessages([{ type: 'system', content: `PDF "${file.name}" loaded successfully! You can now ask questions about it.` }]);
    } catch (err) {
      setError(err.message);
      setPdfName('');
      setPdfId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = e.target.question.value;
    if (!question.trim() || !pdfId) return;

    setMessages(prev => [...prev, { type: 'user', content: question }]);
    e.target.question.value = '';
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          pdf_id: pdfId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'assistant', content: formatResponse(data.answer) }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (response) => {
    // Format the response for better readability, handling bold text
    return response.split('\n').map((line, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {line.split(/\*\*(.*?)\*\*/).map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
        )}
      </p>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md p-4 flex justify-center border-b">
        <h1 className="text-xl font-semibold text-gray-900">PDF Q&A Assistant</h1>
      </header>

      <main className="flex flex-1 w-screen mx-auto p-6 gap-6 overflow-hidden">
        <div className="w-80 bg-white rounded-xl shadow-md p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-14 w-14 text-gray-400" />
            <h3 className="mt-3 text-sm font-medium text-gray-800">
              {pdfName ? 'Change PDF' : 'Upload PDF'}
            </h3>
            <p className="mt-1 text-xs text-gray-500">Drag & drop or click to upload</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files[0])}
              accept=".pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Select PDF
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-4 text-sm ${
                  message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}>{message.content}</div>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50 flex gap-3">
            <input
              type="text"
              name="question"
              placeholder={pdfName ? "Ask a question about your PDF..." : "Upload a PDF to start asking questions"}
              disabled={!pdfName || loading}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!pdfName || loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PdfQA;
