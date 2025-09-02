-- Add comments column to workflow_sessions
ALTER TABLE workflow_sessions 
ADD COLUMN IF NOT EXISTS comments TEXT;
