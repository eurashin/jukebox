DROP DATABASE jukend;
CREATE DATABASE jukend;
USE jukend;

/*entities*/
CREATE TABLE user
(
    user_uri VARCHAR(100) NOT NULL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL
);

CREATE TABLE jam
	(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	host VARCHAR(100) NOT NULL,
    FOREIGN KEY (host) REFERENCES user(user_uri)
	);

CREATE TABLE song
	(
	uri VARCHAR(100) PRIMARY KEY NOT NULL,
	title VARCHAR(100),
	album VARCHAR(100),
	artist VARCHAR(100)
	);

/*relationships*/
CREATE TABLE joins
(
    host_uri VARCHAR(100) NOT NULL,
    user_uri VARCHAR(100) NOT NULL,
    PRIMARY KEY (host_uri, user_uri),
    FOREIGN KEY (user_uri) REFERENCES user(user_uri),
    FOREIGN KEY (host_uri) REFERENCES jam(host)
);

CREATE TABLE stores
(
    user_uri VARCHAR(100) NOT NULL,
    s_uri VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_uri, s_uri),

    FOREIGN KEY (s_uri) REFERENCES song(uri),
    FOREIGN KEY (user_uri) REFERENCES user(user_uri)
);
