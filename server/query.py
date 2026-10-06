from fastapi import APIRouter
from pydantic import BaseModel
from rag import query_rag

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

@router.post("/query")
def query(req: QueryRequest):
    answer = query_rag(req.question)
    return {"answer": answer}