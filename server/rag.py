import os
import ollama
import numpy as np

from PIL import Image

from db import get_vectorstore
from pdf_reader import extract_text_from_pdf
from ocr import extract_text

from langchain_text_splitters import RecursiveCharacterTextSplitter



def document_exists(filename):

    db = get_vectorstore()

    results = db.get(
        where={
            "source": filename
        }
    )

    return len(results["ids"]) > 0


# =====================================
# Process Document
# =====================================

def process_document(file_path):
    filename = os.path.basename(file_path)

    # Already indexed?
    if document_exists(filename):

        print("====================================")
        print(f"{filename} already indexed in ChromaDB.")
        print("Skipping OCR & Embedding.")
        print("====================================")

        return

    extension = os.path.splitext(file_path)[1].lower()

    # -----------------------------
    # PDF
    # -----------------------------

    if extension == ".pdf":

        print("====================================")
        print("PDF Detected")

        # Returns List[str]
        pages = extract_text_from_pdf(file_path)

    # -----------------------------
    # Images
    # -----------------------------

    elif extension in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]:

        print("====================================")
        print("Image Detected")

        image = np.array(
            Image.open(file_path).convert("RGB")
        )

        page_text = extract_text(image)

        pages = [page_text]

    else:

        print("Unsupported File")
        return

    splitter = RecursiveCharacterTextSplitter(

        chunk_size=1200,

        chunk_overlap=250

    )

    texts = []

    metadatas = []

    filename = os.path.basename(file_path)

    lower = filename.lower()

    doc_type = "scheme"

    if (
        "student" in lower
        or "mark" in lower
        or "ia" in lower
    ):
        doc_type = "student"

    # -----------------------------------
    # Process every page separately
    # -----------------------------------

    for page_no, page in enumerate(pages):

        if page is None:
            continue

        page = str(page)

        if len(page.strip()) == 0:
            continue

        print(f"\n========== PAGE {page_no + 1} ==========\n")

        print(page[:4000])

        print("\n===============================\n")

        page_chunks = splitter.split_text(page)

        for chunk_no, chunk in enumerate(page_chunks):

            texts.append(chunk)

            metadatas.append({

                "source": filename,

                "type": doc_type,

                "page": page_no + 1,

                "chunk": chunk_no + 1

            })

    if len(texts) == 0:

        print("No text extracted")

        return

    print(f"\nCreated {len(texts)} chunks")

    db = get_vectorstore()

    db.add_texts(

        texts=texts,

        metadatas=metadatas

    )

    print("Stored in ChromaDB")


# =====================================
# Query
# =====================================

def query_rag(question):

    db = get_vectorstore()

    docs = db.similarity_search(

        question,

        k=5

    )

    if len(docs) == 0:

        return "No matching information found."

    context = ""

    for doc in docs:

        page = doc.metadata.get("page", "?")

        source = doc.metadata.get("source", "")

        context += f"\n========== Source: {source} | Page {page} ==========\n"

        context += doc.page_content

        context += "\n\n"

    prompt = f"""
You are an AI assistant.

Answer ONLY using the uploaded document.

Rules:

1. Never guess.

2. Never use outside knowledge.

3. Use only the retrieved document content.

4. If the answer exists, provide the exact value.

5. Mention the page number whenever possible.

6. If the answer is not present, reply exactly:

I could not find the answer in the uploaded document.

Document:

{context}

Question:

{question}

Answer:
"""

    response = ollama.chat(

        model="mistral",

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]

    )

    return response["message"]["content"]