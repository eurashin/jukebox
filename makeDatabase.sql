DROP DATABASE jukend; 
DROP DATABASE jukend;
CREATE DATABASE jukend;
USE jukend;

/*entities*/
CREATE TABLE user
(
    user_uri VARCHAR(20) NOT NULL PRIMARY KEY, 
    user_uri VARCHAR(20) NOT NULL PRIMARY KEY,
    user_name VARCHAR(20) NOT NULL
);

CREATE TABLE jam 
CREATE TABLE jam
	(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	host VARCHAR(20) NOT NULL,
    FOREIGN KEY (host) REFERENCES user(user_uri)
	);

CREATE TABLE song
	(
	uri VARCHAR(20) PRIMARY KEY NOT NULL,
	title VARCHAR(20),
	album VARCHAR(20),
	artist VARCHAR(20)
	);

/*relationships*/
CREATE TABLE joins
(
    host_uri VARCHAR(20) NOT NULL, 
    user_uri VARCHAR(20) NOT NULL, 
    PRIMARY KEY (host_uri, user_uri), 
    FOREIGN KEY (user_uri) REFERENCES user(user_uri), 
    host_uri VARCHAR(20) NOT NULL,
    user_uri VARCHAR(20) NOT NULL,
    PRIMARY KEY (host_uri, user_uri),
    FOREIGN KEY (user_uri) REFERENCES user(user_uri),
    FOREIGN KEY (host_uri) REFERENCES jam(host)
);

CREATE TABLE stores
(
    user_uri VARCHAR(20) NOT NULL, 
    s_uri VARCHAR(20) NOT NULL, 
    PRIMARY KEY (user_uri, s_uri), 
    
    FOREIGN KEY (s_uri) REFERENCES song(uri), 
    user_uri VARCHAR(20) NOT NULL,
    s_uri VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_uri, s_uri),

    FOREIGN KEY (s_uri) REFERENCES song(uri),
    FOREIGN KEY (user_uri) REFERENCES user(user_uri)
);
