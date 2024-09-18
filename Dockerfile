# Use the official PHP image with Apache
FROM php:8.0-apache

# Install necessary PHP extensions and update package lists
RUN apt-get update && apt-get install -y libzip-dev libonig-dev && \
    docker-php-ext-install pdo pdo_mysql mysqli

# Enable Apache mod_rewrite for .htaccess support
RUN a2enmod rewrite

# Copy files from the local 'www' directory to the container's '/var/www/html'
COPY www/ /var/www/html/

# Ensure the Apache configuration allows overrides and permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html
