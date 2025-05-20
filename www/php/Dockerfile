FROM php:8.2-apache

# Install required extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache rewrite module (optional but often useful)
RUN a2enmod rewrite

# Copy your PHP app into the container
COPY . /var/www/html/

EXPOSE 80
