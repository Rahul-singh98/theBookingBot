from tests.base import app, engine
from fastapi.testclient import TestClient
from app.models import Base
import uuid
import pytest


# Initialize TestClient
client = TestClient(app)

# Set up the database for testing


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create the tables before running any tests
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the tables after running all tests
    Base.metadata.drop_all(bind=engine)

# Helper function to create a chatbot configuration for testing


def create_test_chatbot():
    return {
        "name": "Test Bot",
        "hero_img": "test_image.png",
        "welcome_message": "Welcome to Test Bot",
        "primary_color": "#000000",
        "secondary_color": "#FFFFFF",
        "created_by": str(uuid.uuid4())
    }

# Test for creating a chatbot


def test_create_chatbot():
    chatbot_data = create_test_chatbot()
    response = client.post("/api/chatbots/", json=chatbot_data)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == chatbot_data["name"]
    assert data["hero_img"] == chatbot_data["hero_img"]
    assert data["welcome_message"] == chatbot_data["welcome_message"]
    assert data["primary_color"] == chatbot_data["primary_color"]
    assert data["secondary_color"] == chatbot_data["secondary_color"]

# Test for listing chatbots (pagination)


def test_list_chatbots():
    # Creating multiple chatbots for pagination test
    for _ in range(5):
        client.post("/api/chatbots/", json=create_test_chatbot())

    response = client.get("/api/chatbots/?page=1&size=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2  # Only 2 items per page
    assert data["pagination"]["total_records"] >= 5
    assert data["pagination"]["total_pages"] >= 3

# Test for getting a specific chatbot


def test_get_chatbot():
    chatbot_data = create_test_chatbot()
    create_response = client.post("/api/chatbots/", json=chatbot_data)
    assert create_response.status_code == 200

    chatbot_id = create_response.json()["id"]
    get_response = client.get(f"/api/chatbots/{chatbot_id}")

    assert get_response.status_code == 200
    data = get_response.json()
    assert data["id"] == chatbot_id
    assert data["name"] == chatbot_data["name"]

# Test for updating a chatbot


def test_update_chatbot():
    chatbot_data = create_test_chatbot()
    create_response = client.post("/api/chatbots/", json=chatbot_data)
    assert create_response.status_code == 200

    chatbot_id = create_response.json()["id"]
    update_data = {
        "name": "Updated Bot",
        "hero_img": "updated_image.png",
        "welcome_message": "Updated Welcome Message",
        "primary_color": "#123456",
        "secondary_color": "#654321"
    }

    update_response = client.put(
        f"/api/chatbots/{chatbot_id}", json=update_data)
    assert update_response.status_code == 200
    updated_data = update_response.json()

    assert updated_data["name"] == update_data["name"]
    assert updated_data["hero_img"] == update_data["hero_img"]
    assert updated_data["welcome_message"] == update_data["welcome_message"]

# Test for deleting a chatbot


def test_delete_chatbot():
    chatbot_data = create_test_chatbot()
    create_response = client.post("/api/chatbots/", json=chatbot_data)
    assert create_response.status_code == 200

    chatbot_id = create_response.json()["id"]

    delete_response = client.delete(f"/api/chatbots/{chatbot_id}")
    assert delete_response.status_code == 200

    # Ensure chatbot is deleted
    get_response = client.get(f"/api/chatbots/{chatbot_id}")
    assert get_response.status_code == 404
