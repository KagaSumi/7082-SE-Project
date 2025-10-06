# MySQL Setup Guide
## Environment Configuration

Create a .env file with the following variables:
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=qa_platform
MYSQL_USER=Praxis
MYSQL_PASSWORD=your_praxis_password

# Docker
Please Build the sql image using `docker compose build`
Then to host the databse on your own machine `docker compose up -d` (-d flag will just run it in as a background process)

To tear down the database use `docker compose down`

Note the sql database is currently running on 3306 the normal mysql database port, if you require to change it please edit the docker file.

The container will be called Praxis-db running on port 3306, the backend should be using the user `Praxis` to intract with the database 
