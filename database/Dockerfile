# Use official MySQL image
FROM mysql:8.1

# Copy initialization SQL
COPY Praxis.sql /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306

