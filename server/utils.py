import fitz


def read_pdf(file_path):
    """
    Extract text from a normal searchable PDF.
    """

    doc = fitz.open(file_path)

    text = ""

    for page in doc:

        text += page.get_text()

    doc.close()

    return text