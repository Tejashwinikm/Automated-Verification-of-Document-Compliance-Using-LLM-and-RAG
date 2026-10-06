def verify_assignment(entered_marks, actual_marks):
    """
    Compare entered marks with calculated marks.
    """

    if entered_marks == actual_marks:
        return {
            "status": "Correct",
            "message": "Marks match successfully."
        }

    return {
        "status": "Mismatch",
        "message": f"Entered: {entered_marks}, Expected: {actual_marks}"
    }