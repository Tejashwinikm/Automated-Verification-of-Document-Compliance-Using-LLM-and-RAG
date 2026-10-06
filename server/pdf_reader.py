import fitz
import cv2
import numpy as np

from ocr import extract_text


def extract_text_from_pdf(pdf_path):

    document = fitz.open(pdf_path)

    all_pages = []

    print(f"\nTotal Pages : {len(document)}")

    for page_number in range(len(document)):

        page = document.load_page(page_number)

        print(f"\nProcessing Page {page_number + 1}")

        # -------------------------
        # Try extracting digital text
        # -------------------------

        text = page.get_text("text", sort=True)

        # If digital text extraction is poor,
        # reconstruct using blocks

        if len(text.strip()) < 50:

            blocks = page.get_text("blocks")

            blocks = sorted(blocks, key=lambda b: (b[1], b[0]))

            text = ""

            for block in blocks:
                text += block[4] + "\n"

        # -------------------------
        # OCR fallback
        # -------------------------

        if not text.strip():

            print("Scanned page detected. Running OCR...")

            pix = page.get_pixmap(
                matrix=fitz.Matrix(3, 3)
            )

            image = np.frombuffer(
                pix.samples,
                dtype=np.uint8
            ).reshape(
                pix.height,
                pix.width,
                pix.n
            )

            if pix.n == 4:

                image = cv2.cvtColor(
                    image,
                    cv2.COLOR_RGBA2BGR
                )

            else:

                image = cv2.cvtColor(
                    image,
                    cv2.COLOR_RGB2BGR
                )

            text = extract_text(image)

        else:

            print("Digital page detected.")

        all_pages.append(text)

    document.close()

    return all_pages