-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) UNIQUE NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  visit_date TIMESTAMP NOT NULL,
  diagnosis TEXT NOT NULL,
  symptoms TEXT[],
  findings TEXT NOT NULL DEFAULT '',
  medications JSONB NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  follow_up_date TIMESTAMP,
  doctor_name VARCHAR(255) NOT NULL DEFAULT '',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visits_token ON visits(token);
CREATE INDEX IF NOT EXISTS idx_chat_messages_visit_id ON chat_messages(visit_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON visits TO app_user;
-- GRANT ALL PRIVILEGES ON chat_messages TO app_user;
