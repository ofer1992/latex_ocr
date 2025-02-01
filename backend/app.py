from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlite_utils import Database
import base64
from datetime import datetime
from ocr import process_image_to_latex

# Initialize FastAPI app
app = FastAPI(title="Math OCR API")

# Pydantic model for request
class OCRRequest(BaseModel):
    image: str  # base64 encoded image

# Pydantic model for response
class OCRResponse(BaseModel):
    latex: str

def get_db():
    return Database("math_ocr.db")

# Database setup
def init_db():
    db = get_db()
    
    # Create table to store OCR results if it doesn't exist
    db.create_table(
        "ocr_results",
        {
            "id": int,
            "image": str,
            "latex": str,
            "created_at": str
        },
        pk="id",
        if_not_exists=True
    )

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.post("/ocr", response_model=OCRResponse)
async def ocr_endpoint(request: OCRRequest):
    try:
        # Validate base64 input
        try:
            base64.b64decode(request.image)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=400, detail="Invalid base64 image encoding")
        
        # Process image to get LaTeX
        latex_result = process_image_to_latex(request.image)
        
        # Get database connection
        db = get_db()
        
        # Insert result into database
        result = db["ocr_results"].insert(
            {
                "image": request.image,
                "latex": latex_result,
                "created_at": datetime.utcnow().isoformat()
            },
        )
        
        return OCRResponse(latex=latex_result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Add a health check endpoint
@app.get("/health")
async def health_check():
    try:
        db = get_db()
        # Simple query to verify database connection
        db["ocr_results"].count
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
