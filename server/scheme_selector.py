import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_scheme_document(scheme):

    mapping = {

        "2021-2022": os.path.join(
            BASE_DIR,
            "data",
            "schemes",
            "UG_CIE_2021_2022.pdf"
        ),

        "2023-2024": os.path.join(
            BASE_DIR,
            "data",
            "schemes",
            "UG_CIE_2023_2024.pdf"
        ),

        "2025": os.path.join(
            BASE_DIR,
            "data",
            "schemes",
            "UG_CIE_2025.pdf"
        )

    }

    return mapping.get(scheme)