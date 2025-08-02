-- Enhanced schema for CyberSentinel AI

-- Update users table with admin roles
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;

-- Scenarios table for cybersecurity training scenarios
CREATE TABLE scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    scenario_type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User attempts on scenarios
CREATE TABLE attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('in_progress', 'completed', 'failed', 'abandoned')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    time_taken INTEGER, -- in seconds
    responses JSONB,
    feedback TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced audit logs
DROP TABLE IF EXISTS audit.logs;
CREATE TABLE audit.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) CHECK (status IN ('success', 'failure', 'warning')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles and permissions
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- User sessions for tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'System Administrator', '{"users": ["create", "read", "update", "delete"], "scenarios": ["create", "read", "update", "delete"], "audit": ["read"], "system": ["manage"]}'),
('instructor', 'Training Instructor', '{"scenarios": ["create", "read", "update"], "attempts": ["read"], "users": ["read"]}'),
('user', 'Regular User', '{"scenarios": ["read"], "attempts": ["create", "read"], "profile": ["update"]}');

-- Indexes for performance
CREATE INDEX idx_users_email_active ON users(email) WHERE is_active = TRUE;
CREATE INDEX idx_users_admin ON users(is_admin) WHERE is_admin = TRUE;
CREATE INDEX idx_scenarios_type ON scenarios(scenario_type);
CREATE INDEX idx_scenarios_difficulty ON scenarios(difficulty_level);
CREATE INDEX idx_scenarios_active ON scenarios(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_attempts_user_scenario ON attempts(user_id, scenario_id);
CREATE INDEX idx_attempts_status ON attempts(status);
CREATE INDEX idx_attempts_completed ON attempts(completed_at);
CREATE INDEX idx_audit_user_action ON audit.logs(user_id, action);
CREATE INDEX idx_audit_resource ON audit.logs(resource, resource_id);
CREATE INDEX idx_audit_severity ON audit.logs(severity);
CREATE INDEX idx_audit_created ON audit.logs(created_at);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = TRUE;