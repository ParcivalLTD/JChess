# Use the official PHP image with Apache
FROM php:8.0-apache

# Copy the content from the /www directory into the container's /var/www/html directory
COPY ./www /var/www/html/

# Optional: Set the working directory (not strictly necessary here, but useful if you run other commands)
WORKDIR /var/www/html

# Expose port 80 (default HTTP port)
EXPOSE 80