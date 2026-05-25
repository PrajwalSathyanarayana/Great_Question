"""
Semantic Search Backend
Demonstrates RAG fundamentals with embeddings, vector search, and LLM-based ranking
"""

import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from openai import OpenAI
import faiss
import json

load_dotenv()

app = FastAPI(title="Semantic Search API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Global state for index and documents
class SearchState:
    def __init__(self):
        self.documents = []
        self.embeddings = None
        self.index = None
        self.embedding_dim = 1536  # OpenAI text-embedding-3-small dimension
        
    def is_initialized(self):
        return self.index is not None and len(self.documents) > 0

state = SearchState()

class Document(BaseModel):
    id: str
    text: str
    source: Optional[str] = None

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class SearchResult(BaseModel):
    id: str
    text: str
    source: Optional[str]
    relevance_score: float

class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
    total_results: int

def get_embeddings(texts: list[str]) -> np.ndarray:
    """Get embeddings from OpenAI API"""
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    embeddings = np.array([item.embedding for item in response.data], dtype=np.float32)
    return np.ascontiguousarray(embeddings, dtype=np.float32)


def _ensure_float32_contiguous(x: np.ndarray) -> np.ndarray:
    """Ensure array is dtype float32 and C-contiguous for FAISS."""
    return np.ascontiguousarray(x, dtype=np.float32)

def normalize_embeddings(x: np.ndarray) -> np.ndarray:
    """Prepare and normalize vectors for FAISS cosine similarity."""
    x = np.asarray(x, dtype=np.float32)
    if x.ndim == 1:
        x = x.reshape(1, -1)
    x = _ensure_float32_contiguous(x)
    if x.size == 0:
        return x
    faiss.normalize_L2(x)
    return x

@app.post("/initialize")
async def initialize_index(documents: list[Document]):
    """
    Initialize the semantic search index with documents.
    Generates embeddings and builds FAISS index.
    """
    try:
        if not documents:
            raise HTTPException(status_code=400, detail="No documents provided")
        
        # Store documents
        state.documents = documents
        
        # Generate embeddings for all documents
        doc_texts = [doc.text for doc in documents]
        print(f"Generating embeddings for {len(doc_texts)} documents...")
        embeddings = get_embeddings(doc_texts)
        embeddings = normalize_embeddings(embeddings)
        state.embeddings = embeddings
        
        # Build FAISS index
        state.index = faiss.IndexFlatIP(state.embedding_dim)  # Inner product (cosine similarity)
        state.index.add(embeddings)
        
        return {
            "status": "success",
            "message": f"Index initialized with {len(documents)} documents",
            "documents_count": len(documents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest) -> SearchResponse:
    """
    Semantic search across indexed documents.
    1. Embed query
    2. Find nearest neighbors in vector space
    3. Return ranked results with relevance scores
    """
    try:
        if not state.is_initialized():
            raise HTTPException(status_code=400, detail="Index not initialized. Call /initialize first.")
        
        # Embed query
        query_embedding = normalize_embeddings(get_embeddings([request.query]))
        
        # Search in index
        distances, indices = state.index.search(query_embedding, min(request.top_k, len(state.documents)))
        
        # Build results (distances are similarity scores 0-1 for normalized embeddings)
        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1:  # FAISS returns -1 for invalid results
                continue
            
            doc = state.documents[int(idx)]
            similarity = float(distances[0][i])
            
            results.append(SearchResult(
                id=doc.id,
                text=doc.text,
                source=doc.source,
                relevance_score=similarity
            ))
        
        return SearchResponse(
            query=request.query,
            results=results,
            total_results=len(results)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status")
async def status():
    """Check index status"""
    return {
        "initialized": state.is_initialized(),
        "documents_count": len(state.documents),
        "embedding_model": "text-embedding-3-small"
    }

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
