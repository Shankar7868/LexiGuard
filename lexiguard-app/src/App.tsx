import React, { useState, useRef } from "react";
import { UploadCloud, FileText, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry?url';
import './index.css';

// Set up the pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [concern, setConcern] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a valid PDF file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a valid PDF file.");
      }
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("A PDF document is required.");
      return;
    }

    if (!concern.trim()) {
      setError("Please describe your concern.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Extract text locally in the browser
      setProgressText("Extracting text from PDF (Local)...");
      const pdfText = await extractTextFromPDF(file);
      
      // Step 2: Send lightweight JSON to the proxy
      setProgressText("Sending to AI Analysis Engine...");
      
      const payload = {
        documentText: pdfText,
        Concerns: concern
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the document. Please try again.");
      }

      const text = await response.text();
      try {
        const json = JSON.parse(text);
        setResult(json.output || json.message || JSON.stringify(json, null, 2));
      } catch {
        setResult(text);
      }
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      setProgressText("");
    }
  };

  const resetForm = () => {
    setFile(null);
    setConcern("");
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">LexiGuard</h1>
        <p className="subtitle">AI-Powered Terms & Conditions Analysis</p>
      </header>

      {!isLoading && !result && (
        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label className="form-label">1. Upload Terms & Conditions (PDF)</label>
            
            {file ? (
              <div className="file-selected">
                <FileText className="upload-icon" size={24} style={{ marginBottom: 0 }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p className="upload-text" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </p>
                  <p className="upload-subtext">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div 
                className={`upload-zone ${isDragging ? "drag-active" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="application/pdf" 
                  onChange={handleFileChange} 
                />
                <UploadCloud className="upload-icon" size={48} />
                <p className="upload-text">Click to upload or drag and drop</p>
                <p className="upload-subtext">PDF files only</p>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label className="form-label">2. What is your concern?</label>
            <textarea 
              className="form-textarea" 
              placeholder="E.g., Does this agreement allow the company to share my data? Or simply type 'Summarize this' or 'Is this fair?'"
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
            ></textarea>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div style={{ marginTop: '2.5rem' }}>
            <button type="submit" className="btn" disabled={!file || !concern.trim()}>
              <ShieldCheck size={20} />
              Analyze Document
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="card loading-container">
          <div className="pulse">
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>LexiGuard is analyzing...</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '400px' }}>
            {progressText}
          </p>
        </div>
      )}

      {!isLoading && result && (
        <div className="card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div className="result-header">
            <div style={{ background: 'var(--success)', padding: '0.5rem', borderRadius: '50%', color: 'white', display: 'flex' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="result-title">Analysis Complete</h2>
              <p className="upload-subtext">Based on your provided document</p>
            </div>
          </div>
          
          <div className="result-box">
            {result}
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button onClick={resetForm} className="btn" style={{ width: 'auto', background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
              <RefreshCw size={18} />
              Analyze Another Document
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
