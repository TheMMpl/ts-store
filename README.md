# Number store
## Usage
Clone the repository and install node
```
sudo apt update
sudo apt install nodejs npm -y
```
in the root folder run
```
npm install
```
Install postgress and start the service by running
```
sudo apt install postgresql postgresql-contrib -y
sudo service postgresql start
```
Create a New Database and User
```
CREATE USER your_username WITH PASSWORD 'your_password';
CREATE DATABASE your_database_name;
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
\q
exit
```
Create the tables from `db.sql`
```
psql -U your_username -d your_database_name -f db.sql
```
In the root folder create the `.env` file
```
PGUSER=your_username
PGHOST=127.0.0.1
PGDATABASE=your_database_name
PGPASSWORD=your_password
DB_PORT=5432
```
Run the server directly from `.ts` files by typing
```
npx ts-node-dev --files  src/app.ts
```
You should be able to acces the website at
```
http://localhost:3000
```
## Disclaimer
This repository is no longer maintained, and as such may contain vunerabilities
