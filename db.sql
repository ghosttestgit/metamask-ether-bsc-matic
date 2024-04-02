CREATE TABLE test (
    id int NOT NULL AUTO_INCREMENT,
    mnemonic varchar(255) NOT NULL,
    address varchar(255) NOT NULL UNIQUE,
    eth varchar(255),
    bsc varchar(255),
    matic varchar(255),
    total varchar(255),
    PRIMARY KEY (id)
);