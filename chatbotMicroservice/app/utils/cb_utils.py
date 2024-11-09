import json


def generate_params(session_data):
    return {
        h.get("variable"): h.get("answer")
        for h in json.loads(session_data)
    }
