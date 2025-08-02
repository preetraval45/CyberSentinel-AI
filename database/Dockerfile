FROM postgres:15-alpine

# Install extensions and tools
RUN apk add --no-cache postgresql-contrib curl

# Copy initialization scripts
COPY init/ /docker-entrypoint-initdb.d/

# Set proper permissions
RUN chmod -R 755 /docker-entrypoint-initdb.d/

# Set default environment
ENV POSTGRES_DB=cybersentinel
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1