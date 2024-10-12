import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app
from app.models import User
from app.utils.hashing import get_password_hash
from app.utils.super_admin import create_super_admin
import uuid

# Setup test database (using SQLite for simplicity)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                       "check_same_thread": False})
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Override the dependency
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

ADMIN_TOKEN = None


# Autouse fixture to setup and teardown the database for each test
@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# Helper function to create a test user
def create_test_user(email="test@example.com", username="testuser", password="testpassword"):
    db = TestingSessionLocal()
    hashed_password = get_password_hash(password)
    test_user = User(id=str(uuid.uuid4()), email=email,
                     username=username, hashed_password=hashed_password)
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    db.close()
    return test_user

# Helper function to login as admin user


def generate_admin_token():
    global ADMIN_TOKEN
    if ADMIN_TOKEN is not None:
        return ADMIN_TOKEN

    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@authentication.com",
            "username": "super_admin",
            "password": "#Admin@1234"
        }
    )

    if response.status_code == 200 and "access_token" in response.json():
        ADMIN_TOKEN = response.json().get("access_token")
        return ADMIN_TOKEN

    print("Failed to generate admin token:", response.json())  # Debugging line
    return None


def get_admin_headers():
    token = generate_admin_token()
    if not token:
        raise Exception("No admin token generated")

    print(f"Using admin token: {token}")  # Debugging line

    return {
        "Authorization": f"Bearer {token}"
    }


# Test: Listing users
def test_read_users():
    # Create multiple test users
    create_test_user(email="user1@example.com", username="user1")
    create_test_user(email="user2@example.com", username="user2")

    headers = get_admin_headers()
    response = client.get("/api/users?page=0&limit=10", headers=headers)

    assert response.status_code == 200
    json_resp = response.json()
    assert len(json_resp['items']) == 2
    assert json_resp['pagination']['total'] == 2
    assert json_resp['pagination']['page'] == 0
    assert json_resp['pagination']['limit'] == 10


# Test: Creating a user successfully
def test_create_user_success():
    headers = get_admin_headers()
    response = client.post(
        "/api/users",
        json={
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "newpassword"
        },
        headers=headers
    )
    assert response.status_code == 200
    json_resp = response.json()
    assert json_resp['email'] == "newuser@example.com"
    assert json_resp['username'] == "newuser"


# # Test: Creating a user with an existing email
# def test_create_user_existing_email():
#     # Create a test user
#     create_test_user()

#     # Try to create another user with the same email
#     response = client.post(
#         "/api/users",
#         json={
#             "email": "test@example.com",
#             "username": "anotheruser",
#             "password": "password"
#         }
#     )
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Email already registered"}


# # Test: Reading a user by ID
# def test_read_user():
#     test_user = create_test_user()

#     response = client.get(f"/api/users/{test_user.id}")
#     assert response.status_code == 200
#     json_resp = response.json()
#     assert json_resp['id'] == test_user.id
#     assert json_resp['email'] == "test@example.com"
#     assert json_resp['username'] == "testuser"


# # Test: Reading a non-existing user
# def test_read_non_existing_user():
#     response = client.get("/api/users/non-existing-id")
#     assert response.status_code == 404
#     assert response.json() == {"detail": "User not found"}


# # Test: Updating a user successfully
# def test_update_user():
#     test_user = create_test_user()

#     response = client.put(
#         f"/api/users/{test_user.id}",
#         json={
#             "email": "updated@example.com",
#             "username": "updateduser"
#         }
#     )
#     assert response.status_code == 200
#     json_resp = response.json()
#     assert json_resp['email'] == "updated@example.com"
#     assert json_resp['username'] == "updateduser"


# # Test: Updating a non-existing user
# def test_update_non_existing_user():
#     response = client.put(
#         "/api/users/non-existing-id",
#         json={
#             "email": "updated@example.com",
#             "username": "updateduser"
#         }
#     )
#     assert response.status_code == 404
#     assert response.json() == {"detail": "User not found"}


# # Test: Deleting a user successfully
# def test_delete_user():
#     test_user = create_test_user()

#     response = client.delete(f"/api/users/{test_user.id}")
#     assert response.status_code == 200
#     json_resp = response.json()
#     assert json_resp['id'] == test_user.id
#     assert json_resp['email'] == "test@example.com"


# # Test: Deleting a non-existing user
# def test_delete_non_existing_user():
#     response = client.delete("/api/users/non-existing-id")
#     assert response.status_code == 404
#     assert response.json() == {"detail": "User not found"}
