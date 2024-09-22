from tests.base import app, engine, TestingSessionLocal
from fastapi.testclient import TestClient
from app.models import Base
from app.models import Question, QuestionOption
from app.utils.constants import QuestionTypes
import pytest


client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create the tables before running any tests
    Base.metadata.create_all(bind=engine)
    # Setup: create test data
    db = TestingSessionLocal()
    question = Question(id="test-question-id", bot_id="test-bot", question="Test Question",
                        question_order=1, response_type=QuestionTypes.INPUT, variable="test_var",
                        created_by="test-user")
    db.add(question)
    db.commit()

    option = QuestionOption(id="test-option-id", question_id="test-question-id",
                            option_text="Test Option", option_order=1)
    db.add(option)
    db.commit()

    yield

    # Teardown: clear test data
    db.query(QuestionOption).delete()
    db.query(Question).delete()
    db.commit()
    db.close()

    # Drop the tables after running all tests
    Base.metadata.drop_all(bind=engine)


def test_list_questions():
    response = client.get("/api/questions/")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    assert data["items"][0]["question"] == "Test Question"


def test_read_question():
    response = client.get("/api/questions/test-question-id")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-question-id"
    assert data["question"] == "Test Question"


def test_create_question():
    question_data = {
        "bot_id": "new-bot",
        "question": "New Question",
        "question_order": 2,
        "response_type": QuestionTypes.TEXT,
        "variable": "new_var",
        "created_by": "new-user",
        "options": []
    }
    response = client.post("/api/questions/", json=question_data)
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == "New Question"


def test_update_question():
    update_data = {
        "bot_id": "test-bot",
        "question": "Updated Question",
        "question_order": 2,
        "response_type": QuestionTypes.TEXT,
        "variable": "updated_var",
        "created_by": "test-user",
        "options": []
    }
    response = client.put("/api/questions/test-question-id", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == "Updated Question"


def test_delete_question():
    response = client.delete("/api/questions/test-question-id")
    assert response.status_code == 204


def test_create_question_option():
    option_data = {
        "question_id": "test-question-id",
        "option_text": "New Option",
        "option_order": 2
    }
    response = client.post(
        "/api/questions/test-question-id/options/", json=option_data)
    assert response.status_code == 200
    data = response.json()
    assert data["option_text"] == "New Option"


def test_list_question_options():
    response = client.get("/api/questions/options")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    assert data["items"][0]["option_text"] == "Test Option"


def test_read_question_option():
    response = client.get("/api/questions/options/test-option-id")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-option-id"
    assert data["option_text"] == "Test Option"


def test_update_question_option():
    update_data = {
        "question_id": "test-question-id",
        "option_text": "Updated Option",
        "option_order": 2
    }
    response = client.put(
        "/api/questions/options/test-option-id", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["option_text"] == "Updated Option"


def test_delete_question_option():
    response = client.delete("/api/questions/options/test-option-id")
    assert response.status_code == 204


def test_list_questions_by_qid():
    response = client.get("/api/questions/test-question-id/options/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["option_text"] == "Test Option"

# Error case tests


def test_read_nonexistent_question():
    response = client.get("/api/questions/nonexistent-id")
    assert response.status_code == 404


def test_update_nonexistent_question():
    update_data = {
        "bot_id": "test-bot",
        "question": "Updated Question",
        "question_order": 2,
        "response_type": QuestionTypes.TEXT,
        "variable": "updated_var",
        "created_by": "test-user",
        "options": []
    }
    response = client.put("/api/questions/nonexistent-id", json=update_data)
    assert response.status_code == 404


def test_delete_nonexistent_question():
    response = client.delete("/api/questions/nonexistent-id")
    assert response.status_code == 404


def test_create_option_for_nonexistent_question():
    option_data = {
        "question_id": "nonexistent-id",
        "option_text": "New Option",
        "option_order": 2
    }
    response = client.post(
        "/api/questions/nonexistent-id/options/", json=option_data)
    assert response.status_code == 404


def test_read_nonexistent_question_option():
    response = client.get("/api/questions/options/nonexistent-id")
    assert response.status_code == 404


def test_update_nonexistent_question_option():
    update_data = {
        "question_id": "test-question-id",
        "option_text": "Updated Option",
        "option_order": 2
    }
    response = client.put(
        "/api/questions/options/nonexistent-id", json=update_data)
    assert response.status_code == 404


def test_delete_nonexistent_question_option():
    response = client.delete("/api/questions/options/nonexistent-id")
    assert response.status_code == 404
