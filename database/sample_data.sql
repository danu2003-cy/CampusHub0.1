-- ============================================================
-- CampusHub Sample Data
-- Run schema.sql first, then this file, to get a working dev DB.
-- ============================================================



-- ---------- users ----------
INSERT INTO users (name, email, password, role) VALUES
('Alice Admin', 'alice.admin@campushub.edu', 'password123', 'ADMIN'),
('Bob Student', 'bob.student@campushub.edu', 'password123', 'STUDENT'),
('Carla Chen', 'carla.chen@campushub.edu', 'password123', 'STUDENT'),
('David Perera', 'david.perera@campushub.edu', 'password123', 'STUDENT');

-- ---------- clubs ----------
INSERT INTO clubs (name, description, created_by) VALUES
('Computer Science Society', 'A club for CS students to collaborate on projects and events.', 1),
('Photography Club', 'For students who love photography and visual storytelling.', 2);

-- ---------- club_members ----------
INSERT INTO club_members (club_id, user_id, role_in_club) VALUES
(1, 2, 'MEMBER'),
(1, 3, 'MEMBER'),
(2, 3, 'PRESIDENT'),
(2, 4, 'MEMBER');

-- ---------- events ----------
INSERT INTO events (club_id, title, description, event_date, location, created_by) VALUES
(1, 'Intro to Web Development Workshop', 'Hands-on workshop covering HTML, CSS and JavaScript basics.', '2026-08-10 14:00:00', 'Room 204, Engineering Block', 1),
(2, 'Campus Photo Walk', 'A guided photo walk around campus to practice composition skills.', '2026-08-15 09:00:00', 'Main Campus Entrance', 2);

-- ---------- registrations ----------
INSERT INTO registrations (event_id, user_id, status) VALUES
(1, 2, 'CONFIRMED'),
(1, 3, 'PENDING'),
(2, 3, 'CONFIRMED'),
(2, 4, 'CONFIRMED');

-- ---------- announcements ----------
INSERT INTO announcements (club_id, title, content, posted_by) VALUES
(1, 'Welcome to the new semester!', 'We have exciting workshops planned this semester, stay tuned.', 1),
(2, 'Photo Walk Rescheduled', 'The photo walk has been moved to next week due to weather.', 2);

-- ---------- feedback ----------
INSERT INTO feedback (event_id, user_id, rating, comments) VALUES
(1, 2, 5, 'Really useful workshop, learned a lot!'),
(2, 4, 4, 'Great experience, would join again.');
