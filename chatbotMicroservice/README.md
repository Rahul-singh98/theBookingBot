# Chatbot Microservice

This is a FastAPI-based microservice for managing chatbots, questions, and chat sessions.

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd chatbot_microservice
   ```

2. Create a virtual environment and activate it:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:

   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   uvicorn app.main:app --reload
   ```

The application will be available at `http://localhost:8000`.

## API Documentation

Once the application is running, you can access the automatically generated API documentation at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `POST /chatbots/`: Create a new chatbot
- `GET /chatbots/{chatbot_id}`: Get chatbot details
- `POST /chatbots/{chatbot_id}/questions/`: Create a new question for a chatbot
- `GET /chatbots/{chatbot_id}/questions/`: Get all questions for a chatbot
- `POST /chat/start-session/{chatbot_id}`: Start a new chat session
- `POST /chat/{session_id}/answer`: Answer a question in a chat session
- `GET /chat/{session_id}/next-question`: Get the next question in a chat session
- `POST /chat/{session_id}/submit`: Submit all responses for a chat session

## Database

This microservice uses SQLite as the database. The database file `chatbot.db` will be created in the root directory when you run the application for the first time.

## Testing

To run tests (once implemented), use the following command:

```
pytest
```

## Contributing

Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
