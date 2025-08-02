#!/bin/bash

# SSL Setup Script for CyberSentinel AI
# This script sets up SSL certificates using Let's Encrypt

DOMAIN="cybersentinel.local"
EMAIL="admin@cybersentinel.local"
SSL_DIR="/etc/nginx/ssl"

echo "🔒 Setting up SSL certificates for CyberSentinel AI..."

# Check if running in production
if [ "$ENVIRONMENT" = "production" ]; then
    echo "📋 Production environment detected - using Let's Encrypt"
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        echo "Installing certbot..."
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Stop nginx temporarily
    docker-compose stop nginx
    
    # Generate Let's Encrypt certificate
    certbot certonly --standalone \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --domains $DOMAIN,www.$DOMAIN
    
    # Copy certificates to nginx directory
    mkdir -p $SSL_DIR
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem
    
    # Set up auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
    
    echo "✅ Let's Encrypt certificates installed successfully"
    
else
    echo "🔧 Development environment - generating self-signed certificates"
    
    # Create SSL directory
    mkdir -p $SSL_DIR
    
    # Generate self-signed certificate
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $SSL_DIR/key.pem \
        -out $SSL_DIR/cert.pem \
        -subj "/C=US/ST=State/L=City/O=CyberSentinel/CN=$DOMAIN"
    
    echo "✅ Self-signed certificates generated successfully"
fi

# Set proper permissions
chmod 600 $SSL_DIR/key.pem
chmod 644 $SSL_DIR/cert.pem

# Add domain to hosts file for development
if [ "$ENVIRONMENT" != "production" ]; then
    if ! grep -q "$DOMAIN" /etc/hosts; then
        echo "127.0.0.1 $DOMAIN www.$DOMAIN" >> /etc/hosts
        echo "📝 Added $DOMAIN to /etc/hosts"
    fi
fi

echo "🚀 SSL setup complete! Access your application at https://$DOMAIN"