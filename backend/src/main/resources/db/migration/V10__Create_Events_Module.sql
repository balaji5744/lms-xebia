-- ==========================================
-- V10__Create_Events_Module.sql
-- Create events and event_registrations tables
-- ==========================================

CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    banner_url TEXT,
    banner_file_name VARCHAR(255),
    location_mode VARCHAR(50) NOT NULL,
    venue VARCHAR(255),
    meeting_link TEXT,
    meeting_provider VARCHAR(50),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    registration_deadline TIMESTAMP NOT NULL,
    capacity INTEGER NOT NULL,
    registered_count INTEGER NOT NULL DEFAULT 0,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uq_events_slug UNIQUE (slug),
    CONSTRAINT chk_events_capacity CHECK (capacity > 0),
    CONSTRAINT chk_events_registered_count CHECK (registered_count >= 0)
);

CREATE TABLE IF NOT EXISTS event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(50) NOT NULL,
    certificate_issued BOOLEAN NOT NULL DEFAULT FALSE,
    certificate_issued_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uq_event_student UNIQUE (event_id, student_id)
);

-- Indexes for performance optimization on common query fields
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_registration_deadline ON events(registration_deadline);
CREATE INDEX IF NOT EXISTS idx_events_location_mode ON events(location_mode);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_student ON event_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_student ON event_registrations(event_id, student_id);
