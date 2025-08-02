#!/bin/bash

# Database backup script for CyberSentinel AI

set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cybersentinel_backup_${DATE}.sql"
RETENTION_DAYS=7

echo "Starting database backup at $(date)"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform database backup
pg_dump -h database -U postgres -d cybersentinel > "${BACKUP_DIR}/${BACKUP_FILE}"

# Compress the backup
gzip "${BACKUP_DIR}/${BACKUP_FILE}"

echo "Backup completed: ${BACKUP_FILE}.gz"

# Clean up old backups (keep only last 7 days)
find $BACKUP_DIR -name "cybersentinel_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup cleanup completed"

# Log backup size
BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}.gz" | cut -f1)
echo "Backup size: $BACKUP_SIZE"

echo "Database backup finished at $(date)"