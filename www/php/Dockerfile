FROM php:8.2-apache

# Install mysqli and other useful extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install mysqli

# Enable Apache mod_rewrite if needed
RUN a2enmod rewrite

# Copy PHP code into container
COPY . /var/www/html/

EXPOSE 80
