DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'nextjs') THEN
        CREATE USER nextjs WITH PASSWORD 'nextjs';
    END IF;
END
$$;

CREATE SCHEMA IF NOT EXISTS nextjs;
GRANT ALL ON SCHEMA nextjs TO nextjs;
GRANT ALL ON SCHEMA public TO nextjs;

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rolle INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (rolle) REFERENCES roles(id)
);

