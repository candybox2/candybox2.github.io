def jsFormat(text):
    for tup in [("\\", "\\\\"), ("\"", "\\\"")]:
        text = text.replace(tup[0], tup[1])
    return text
