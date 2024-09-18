# Use the official PHP image with Apache
FROM php:8.0-apache

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy files from the local 'www' directory to the container's '/var/www/html'
COPY www/ /var/www/html/

# Ensure the Apache configuration allows overrides and permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Set the working directory for npm
WORKDIR /var/www/html

# Install dependencies and run the npm start script
RUN npm install
CMD ["npm", "run", "start"]
