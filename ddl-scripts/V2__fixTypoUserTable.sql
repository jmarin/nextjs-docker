ALTER TABLE users 
    DROP CONSTRAINT fk_user_role,
    RENAME COLUMN rolle TO role;

ALTER TABLE users 
    ADD CONSTRAINT fk_user_role 
    FOREIGN KEY (role) REFERENCES roles(id);