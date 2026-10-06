import json
import os

SAVE_DIR = "data/students"

os.makedirs(SAVE_DIR, exist_ok=True)


def save_student(data):

    filename = data.get("usn") or "student"

    path = os.path.join(
        SAVE_DIR,
        f"{filename}.json"
    )

    with open(path, "w") as f:
        json.dump(
            data,
            f,
            indent=4
        )

    return path