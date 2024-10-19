# import pytest
# from fastapi.testclient import TestClient
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from app.database import Base, get_db
# from app.main import app
# from app.models import User
# from app.utils.hashing import get_password_hash
# import uuid

# # Setup test database
# SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
#                        "check_same_thread": False})
# TestingSessionLocal = sessionmaker(
#     autocommit=False, autoflush=False, bind=engine)

# Base.metadata.create_all(bind=engine)


# def override_get_db():
#     try:
#         db = TestingSessionLocal()
#         yield db
#     finally:
#         db.close()


# app.dependency_overrides[get_db] = override_get_db

# client = TestClient(app)


# @pytest.fixture(autouse=True)
# def setup_db():
#     Base.metadata.create_all(bind=engine)
#     yield
#     Base.metadata.drop_all(bind=engine)


# def create_test_user(email="test@example.com", password="testpassword"):
#     db = TestingSessionLocal()
#     hashed_password = get_password_hash(password)
#     test_user = User(id=str(uuid.uuid4()), email=email, username="testuser",
#                      hashed_password=hashed_password)
#     db.add(test_user)
#     db.commit()
#     db.refresh(test_user)
#     db.close()
#     return test_user


# def test_register_success():
#     response = client.post(
#         "/api/auth/register",
#         json={
#             "email": "newuser@example.com",
#             "first_name": "new",
#             "last_name": "user",
#             "username": "newuser",
#             "password": "newpassword"
#         }
#     )
#     assert response.status_code == 201
#     assert response.json() == {"msg": "User created successfully"}


# def test_register_existing_email():
#     create_test_user()
#     response = client.post(
#         "/api/auth/register",
#         json={"email": "test@example.com",
#               "username": "newuser", "password": "newpassword"}
#     )
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Email already registered"}


# def test_login_success():
#     create_test_user()
#     response = client.post(
#         "/api/auth/login",
#         json={"email": "test@example.com", "password": "testpassword"}
#     )
#     assert response.status_code == 200
#     assert "access_token" in response.json()
#     assert response.json()["token_type"] == "bearer"


# def test_login_invalid_credentials():
#     create_test_user()
#     response = client.post(
#         "/api/auth/login",
#         json={"email": "test@example.com", "password": "wrongpassword"}
#     )
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Invalid credentials"}


# # def test_password_reset_request_success():
# #     create_test_user()
# #     response = client.post(
# #         "/api/auth/password-reset-request",
# #         json={"email": "test@example.com"}
# #     )
# #     assert response.status_code == 200
# #     assert response.json() == {"msg": "Password reset email sent"}


# # def test_password_reset_request_user_not_found():
# #     response = client.post(
# #         "/api/auth/password-reset-request",
# #         json={"email": "nonexistent@example.com"}
# #     )
# #     assert response.status_code == 404
# #     assert response.json() == {"detail": "User not found"}


# # def test_password_reset_confirm_success(mocker):
# #     create_test_user()
# #     # Mock the decode_access_token function to return a valid payload
# #     mocker.patch('app.utils.jwt_handler.decode_access_token',
# #                  return_value={"sub": "test@example.com"})

# #     response = client.post(
# #         "/api/auth/password-reset-confirm",
# #         json={"token": "valid_token", "new_password": "newpassword123"}
# #     )
# #     assert response.status_code == 200
# #     assert response.json() == {"msg": "Password has been reset successfully"}


# # def test_password_reset_confirm_invalid_token(mocker):
# #     # Mock the decode_access_token function to return None (invalid token)
# #     mocker.patch('app.utils.jwt_handler.decode_access_token',
# #                  return_value=None)

# #     response = client.post(
# #         "/api/auth/password-reset-confirm",
# #         json={"token": "invalid_token", "new_password": "newpassword123"}
# #     )
# #     assert response.status_code == 400
# #     assert response.json() == {"detail": "Invalid token"}


# # def test_password_reset_confirm_user_not_found(mocker):
# #     # Mock the decode_access_token function to return a valid payload
# #     mocker.patch('app.utils.jwt_handler.decode_access_token',
# #                  return_value={"sub": "nonexistent@example.com"})

# #     response = client.post(
# #         "/api/auth/password-reset-confirm",
# #         json={"token": "valid_token", "new_password": "newpassword123"}
# #     )
# #     assert response.status_code == 404
# #     assert response.json() == {"detail": "User not found"}
