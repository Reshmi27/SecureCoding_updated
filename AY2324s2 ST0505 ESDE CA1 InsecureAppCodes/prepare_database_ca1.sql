DROP database if exists ay2324s2_st0505_esde_ca;
Create Database ay2324s2_st0505_esde_ca CHARACTER SET latin1 COLLATE latin1_general_ci;
Use ay2324s2_st0505_esde_ca;
CREATE TABLE user (
     user_id int NOT NULL AUTO_INCREMENT,
     fullname varchar(255) NOT NULL,
     email varchar(100) NOT NULL,
     user_password varchar(255),
     role_id int NOT NULL,
     PRIMARY KEY (user_Id),
     UNIQUE (email)
)AUTO_INCREMENT=100;   

CREATE TABLE role(
     role_id int NOT NULL AUTO_INCREMENT,
     role_name varchar(255) NOT NULL,
     PRIMARY KEY (role_id),
     UNIQUE(role_name)
)AUTO_INCREMENT=1;   
insert role (role_name) values ('admin');
insert role (role_name) values ('user');

CREATE TABLE file (
     file_id int NOT NULL AUTO_INCREMENT,
     cloudinary_file_id varchar(255) NOT NULL,
     cloudinary_url varchar(255) NOT NULL,
     design_title varchar(2000) NOT NULL,
     design_description varchar(2000) NOT NULL,
     created_by_id int,
     PRIMARY KEY (file_id)
)AUTO_INCREMENT=100;   

DROP USER IF EXISTS 'esde_ca_adminuser'@'%';
CREATE USER 'esde_ca_adminuser'@'%' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON ay2324s2_st0505_esde_ca.* TO 'esde_ca_adminuser'@'%';







