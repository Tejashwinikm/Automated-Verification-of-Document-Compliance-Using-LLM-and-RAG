def detect_scheme(usn):

    usn = usn.upper()

    if usn.startswith("4SO21"):
        return "2021-2022"

    elif usn.startswith("4SO22"):
        return "2021-2022"

    elif usn.startswith("4SO23"):
        return "2023-2024"

    elif usn.startswith("4SO24"):
        return "2023-2024"

    elif usn.startswith("4SO25"):
        return "2025"

    return "Unknown"