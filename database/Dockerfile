FROM postgres:15-alpine

# Install extensions
RUN apk add --no-cache postgresql-contrib

# Copy initialization scripts
COPY init/ /docker-entrypoint-initdb.d/

# Set default environment
ENV POSTGRES_DB=cybersentinel
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

EXPOSE 5432