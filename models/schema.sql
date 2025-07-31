-- schema, i run this from the terminal/mysqlserver app

DROP DATABASE IF EXISTS watchNow;

CREATE DATABASE IF NOT EXISTS watchNow;

USE watchNow;

CREATE TABLE IF NOT EXISTS users (
    id INT(50) AUTO_INCREMENT, 
    username VARCHAR(50) UNIQUE, 
    email VARCHAR(50) UNIQUE, 
    hashedPassword VARCHAR(100), 
    bio VARCHAR(500), 
    banner VARCHAR(50), 
    pfp VARCHAR(50),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS videos (
    id INT(50) AUTO_INCREMENT, 
    title VARCHAR(50), 
    uploaderId INT(50), 
    fileName VARCHAR(50) UNIQUE, 
    description VARCHAR(500), 
    views INT(50), 
    dateOfUpload VARCHAR(50), 
    contractAddress VARCHAR(50), 
    PRIMARY KEY(id),
    FOREIGN KEY(uploaderId) references users(id) 
);

CREATE TABLE IF NOT EXISTS subscribed ( 
    subscriberId INT(50), 
    subscribedToId INT(50), 
    UNIQUE(subscriberId, subscribedToId) 
);

CREATE TABLE IF NOT EXISTS reactedTo ( 
    reactId INT(50), 
    originalId INT(50), 
    UNIQUE(reactId, originalId) 
);

SELECT * FROM users;
SELECT * FROM videos;
SELECT * FROM reactedTo;
SELECT * FROM subscribed;