from datetime import datetime

def calculate_assignment_marks(submission_time, deadline):
    """
    Calculate assignment marks based on submission time.
    """

    if submission_time <= deadline:
        return 10

    elif submission_time <= deadline.replace(hour=17):
        return 8

    else:
        return 5