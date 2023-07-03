CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  user_name VARCHAR(30),
  messages TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
