# chat/utils.py

def initials(value):
    initials = ""
    for name in value.strip().split():
        if name and len(initials) < 3:
            initials += name[0].upper()
    return initials
