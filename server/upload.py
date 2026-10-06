import os

from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

from rag import process_document, document_exists

router = APIRouter()

UPLOAD_DIR = "data/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".bmp"
}


@router.post("/upload")
async def upload(files: List[UploadFile] = File(...)):

    uploaded = []

    try:

        for file in files:

            filename = file.filename

            extension = os.path.splitext(filename)[1].lower()

            if extension not in ALLOWED_EXTENSIONS:

                raise HTTPException(

                    status_code=400,

                    detail=f"{filename} is not a supported file."

                )

            path = os.path.join(UPLOAD_DIR, filename)

            # ===========================================
            # Already exists on disk AND already indexed
            # ===========================================

            if os.path.exists(path) and document_exists(filename):

                print("====================================")
                print(f"{filename} already exists.")
                print("Already indexed.")
                print("Skipping upload.")
                print("====================================")

                uploaded.append(filename)

                continue

            # ===========================================
            # Save file
            # ===========================================

            with open(path, "wb") as f:

                f.write(await file.read())

            print("====================================")
            print(f"Uploaded : {filename}")
            print(f"Saved At : {path}")
            print("====================================")

            # ===========================================
            # OCR + Chunk + Embedding + Chroma
            # ===========================================

            process_document(path)

            uploaded.append(filename)

            print(f"Indexed : {filename}")

        print("\nAll Files Uploaded Successfully\n")

        return {

            "success": True,

            "files": uploaded,

            "message": f"{len(uploaded)} file(s) processed."

        }

    except HTTPException:

        raise

    except Exception as e:

        print("\nUpload Error")

        print(e)

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )