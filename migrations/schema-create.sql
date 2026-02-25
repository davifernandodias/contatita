CREATE TABLE contacts (
    id NUMERIC(14) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age NUMERIC(3)
);

CREATE TABLE phones (
    contact_id NUMERIC(14) NOT NULL,
    id NUMERIC(14) NOT NULL,
    number VARCHAR(16) NOT NULL,
    CONSTRAINT pk_phones PRIMARY KEY (contact_id, id),
    CONSTRAINT fk_phones_contact FOREIGN KEY (contact_id) REFERENCES contacts(id)
);