import re

def extract_student_details(text):

    data = {}

    # -------------------------
    # USN
    # -------------------------
    usn = re.search(r'4SO\d{2}[A-Z]{2}\d{3}', text.upper())
    if usn:
        data["USN"] = usn.group()

    # -------------------------
    # Student Name
    # -------------------------
    name = re.search(r'NAME[:\-\s]*([A-Z ]+)', text.upper())
    if name:
        data["NAME"] = name.group(1).strip()

    # -------------------------
    # CIE 1
    # -------------------------
    cie1 = re.search(r'CIE\s*1[:\-\s]*(\d+)', text.upper())
    if cie1:
        data["CIE1"] = int(cie1.group(1))

    # -------------------------
    # CIE 2
    # -------------------------
    cie2 = re.search(r'CIE\s*2[:\-\s]*(\d+)', text.upper())
    if cie2:
        data["CIE2"] = int(cie2.group(1))

    # -------------------------
    # Attendance
    # -------------------------
    attendance = re.search(r'ATTENDANCE[:\-\s]*(\d+)', text.upper())
    if attendance:
        data["ATTENDANCE"] = int(attendance.group(1))

    return data