-- Insert roles
INSERT INTO roles (name) VALUES
    ('admin'),
    ('user'),
    ('guest');

-- Insert sample users
-- Note: In a real application, passwords should be hashed
-- These are example passwords using bcrypt hashing
INSERT INTO users (username, password, email, role) VALUES
    ('admin', '$2a$12$LQV3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpzDLHuWGbPsye', 'admin@example.com', 1),  -- password: admin123
    ('john_doe', '$2a$12$ZPJqLr1Nx8FgBtHI4wS8/OEDi5ZQsHnUuSNrgnKlVHWPVwyhD3pJi', 'john@example.com', 2),  -- password: user123
    ('jane_smith', '$2a$12$Rq4nEnYaS2WQUhVnVsEXi.6vQ6QR8XrWtxBR5TzeP3JvRzJHjzRky', 'jane@example.com', 2),  -- password: user456
    ('guest_user', '$2a$12$LJnN5pK3VkxPwviG4P/DOeYw/K6dUqp3nK4JDI.UUfBZU7.nEPMAi', 'guest@example.com', 3);  -- password: guest789