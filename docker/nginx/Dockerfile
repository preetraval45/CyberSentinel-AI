FROM nginx:alpine

# Install openssl for certificate generation
RUN apk add --no-cache openssl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed certificate for development
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=CyberSentinel/CN=cybersentinel.local"

# Create log directory
RUN mkdir -p /var/log/nginx

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]