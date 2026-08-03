-- ============================================================
-- CampusHub Database Schema
-- University Event & Student Activity Management System
-- ============================================================

CREATE DATABASE IF NOT EXISTS campushub_db;
USE campushub_db;

-- ---------- users ----------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT'
);

-- ---------- clubs ----------
CREATE TABLE IF NOT EXISTS clubs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_by BIGINT,
    CONSTRAINT fk_clubs_created_by FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL
);

-- ---------- club_members ----------
CREATE TABLE IF NOT EXISTS club_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role_in_club VARCHAR(50),
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_club_members_club FOREIGN KEY (club_id) REFERENCES clubs(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_club_members_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_club_member UNIQUE (club_id, user_id)
);

-- ---------- events ----------
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    event_date DATETIME,
    location VARCHAR(200),
    created_by BIGINT,
    CONSTRAINT fk_events_club FOREIGN KEY (club_id) REFERENCES clubs(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_events_created_by FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL
);

-- ---------- registrations ----------
CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_registrations_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_registration UNIQUE (event_id, user_id)
);

-- ---------- announcements ----------
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT,
    posted_by BIGINT,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcements_club FOREIGN KEY (club_id) REFERENCES clubs(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_announcements_posted_by FOREIGN KEY (posted_by) REFERENCES users(id)
        ON DELETE SET NULL
);

-- ---------- feedback ----------
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT,
    comments TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_event FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_feedback_rating CHECK (rating BETWEEN 1 AND 5)
);
