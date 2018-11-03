USE jukend; 

/*entities*/
CREATE TABLE user
(
    userURI VARCHAR(20) NOT NULL PRIMARY KEY
);

CREATE TABLE jam 
	(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	host VARCHAR(20) NOT NULL,
    FOREIGN KEY (host) REFERENCES user(userURI)
	);

CREATE TABLE song
	(
	URI VARCHAR(20) PRIMARY KEY NOT NULL,
	title VARCHAR(20),
	artist VARCHAR(20)
	);

/*relationships*/
CREATE TABLE joins
(
    jid INT NOT NULL, 
    userURI VARCHAR(20) NOT NULL, 
    PRIMARY KEY (jid, userURI), 
    FOREIGN KEY (userURI) REFERENCES user(userURI), 
    FOREIGN KEY (jid) REFERENCES jam(id)
);

CREATE TABLE stores
(
    userURI VARCHAR(20) NOT NULL, 
    sURI VARCHAR(20) NOT NULL, 
    PRIMARY KEY (userURI, sURI), 
    
    FOREIGN KEY (sURI) REFERENCES song(URI), 
    FOREIGN KEY (userURI) REFERENCES user(userURI)
);
