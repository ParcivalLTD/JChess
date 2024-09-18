# Use the official PHP image with Apache
FROM php:8.0-apache

# Copy files from the local 'www' directory to the container's '/var/www/html'
COPY www/ /var/www/html/

# Ensure the Apache configuration allows overrides and permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html
