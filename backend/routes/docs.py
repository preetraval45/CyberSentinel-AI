from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.docs_service import DocsService
from typing import List, Optional

router = APIRouter(prefix="/api/docs", tags=["docs"])

class SearchRequest(BaseModel):
    query: str

class ChatRequest(BaseModel):
    message: str
    session_id: str
    context_docs: Optional[List[str]] = None

@router.get("/search")
async def search_docs(q: str):
    results = DocsService.search_documents(q)
    return {"results": results}

@router.get("/categories")
async def get_categories():
    return {
        "categories": [
            {"id": "basics", "name": "Getting Started", "count": 5},
            {"id": "training", "name": "Training Guides", "count": 12},
            {"id": "api", "name": "API Reference", "count": 8},
            {"id": "troubleshooting", "name": "Troubleshooting", "count": 6}
        ]
    }

@router.get("/{slug}")
async def get_document(slug: str):
    doc = DocsService.get_document(slug)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.post("/chat")
async def chat_with_docs(request: ChatRequest):
    try:
        response = await DocsService.chat_with_docs(request.message, request.context_docs)
        related_docs = DocsService.get_related_docs(request.message)
        
        return {
            "response": response,
            "related_docs": related_docs,
            "session_id": request.session_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/category/{category}")
async def get_docs_by_category(category: str):
    # Mock category documents
    return {
        "documents": [
            {"title": "Doc 1", "slug": "doc-1", "excerpt": "Brief description..."},
            {"title": "Doc 2", "slug": "doc-2", "excerpt": "Brief description..."}
        ]
    }