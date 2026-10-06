from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Load embedding model ONLY ONCE
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load ChromaDB ONLY ONCE
db = Chroma(
    persist_directory="data/chroma_db",
    embedding_function=embedding
)


def get_vectorstore():
    return db