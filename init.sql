USE database;

CREATE TABLE roles (
  id INT PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

INSERT INTO roles (id, name) VALUES (1, 'ROLE_TEACHER'), (2, 'ROLE_STUDENT');