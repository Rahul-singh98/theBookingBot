-- Create the database
CREATE DATABASE IF NOT EXISTS sequential_chatbot;
USE sequential_chatbot;

-- Create table for chat sessions
CREATE TABLE chat_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL
);

-- Create table for questions
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_order INT NOT NULL,
    response_type ENUM('text', 'number', 'single_choice', 'multiple_choice', 'date') NOT NULL,
    is_required BOOLEAN DEFAULT TRUE
);

-- Create table for question options (for single and multiple choice questions)
CREATE TABLE question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    option_order INT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Create table for user responses
CREATE TABLE user_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    question_id INT NOT NULL,
    response_text TEXT,
    response_number DECIMAL(10, 2),
    response_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Create table for multiple choice responses
CREATE TABLE multiple_choice_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_response_id INT NOT NULL,
    question_option_id INT NOT NULL,
    FOREIGN KEY (user_response_id) REFERENCES user_responses(id) ON DELETE CASCADE,
    FOREIGN KEY (question_option_id) REFERENCES question_options(id) ON DELETE CASCADE
);

-- Create table for chat configuration
CREATE TABLE chat_configuration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    welcome_message TEXT,
    completion_message TEXT,
    chat_title VARCHAR(255),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7)
);

-- Insert some sample data
INSERT INTO questions (question_text, question_order, response_type) VALUES
('What is your name?', 1, 'text'),
('How old are you?', 2, 'number'),
('What is your favorite color?', 3, 'single_choice'),
('Which programming languages do you know?', 4, 'multiple_choice'),
('When is your birthday?', 5, 'date');

INSERT INTO question_options (question_id, option_text, option_order) VALUES
(3, 'Red', 1),
(3, 'Blue', 2),
(3, 'Green', 3),
(3, 'Yellow', 4),
(4, 'Python', 1),
(4, 'JavaScript', 2),
(4, 'Java', 3),
(4, 'C++', 4),
(4, 'Ruby', 5);

INSERT INTO chat_configuration (welcome_message, completion_message, chat_title, primary_color, secondary_color) VALUES
('Welcome to our chatbot! Please answer the following questions.', 'Thank you for completing the survey!', 'Sample Sequential Chatbot', '#007bff', '#6c757d');