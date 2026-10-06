import cv2
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()


def preprocess_image(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    gray = cv2.resize(
        gray,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    return gray


def extract_text(image):

    processed = preprocess_image(image)

    result, _ = ocr(processed)

    text = ""

    if result:

        for line in result:

            text += line[1] + "\n"

    return text