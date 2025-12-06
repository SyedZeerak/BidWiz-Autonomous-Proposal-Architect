from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import shutil
import os

# Import your AI Engine
from backend import engine

# Import your ReportLab automation functions
from automation import generate_pdf_proposal, send_email_with_attachment

app = FastAPI()

# --- CORS Policy (Critical for Frontend Connection) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class AnalysisRequest(BaseModel):
    requirement: str
    tone: str = "Professional"

class FinalizeRequest(BaseModel):
    responses: list # List of [Requirement, Answer]
    email: str

# --- Endpoints ---

@app.get("/api/status")
async def status():
    return {"status": "ok", "message": "BidWiz backend running!"}

@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    return {"filename": file.filename, "status": "uploaded"}

@app.post("/api/train")
async def train_pdf(file: UploadFile = File(...)):
    if not file:
        return JSONResponse({"detail": "No file uploaded"}, status_code=400)
    
    tmp_path = f"temp_{file.filename}"
    try:
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        success, msg = engine.ingest_knowledge_base(tmp_path)
        
        if success:
            return JSONResponse({"message": "Knowledge base loaded successfully!"})
        else:
            return JSONResponse({"detail": msg}, status_code=500)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/api/analyze")
async def generate_response(request: AnalysisRequest):
    try:
        response = engine.analyze_requirement(request.requirement, request.tone)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/finalize")
async def finalize_proposal(request: FinalizeRequest):
    try:
        # 1. Generate PDF (Using your ReportLab code)
        pdf_path = generate_pdf_proposal(request.responses)
        
        # 2. Send Email (Using your SMTP code)
        status = send_email_with_attachment(request.email, pdf_path)
        
        if "Successfully" in status:
            return {"status": "success", "file": pdf_path}
        else:
            raise HTTPException(status_code=500, detail=status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))