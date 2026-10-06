from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from upload import router as upload_router
from query import router as query_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ NO PREFIX
app.include_router(upload_router)
app.include_router(query_router)

@app.get("/")
def home():
    return {"message": "Backend Running"}