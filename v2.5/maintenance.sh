#!/bin/bash
WATCH_DIR="/var/www/html/hindley.tech"
FLAG_FILE="/var/www/html/maintenance.flag"
LOG_FILE="/var/www/html/maintenance.log"
HTACCESS_FILE="/var/www/html/hindley.tech/.htaccess"

# Function to enable maintenance mode
enable_maintenance() {
    if [ ! -f $FLAG_FILE ]; then
        touch $FLAG_FILE
        echo "RewriteEngine On" > $HTACCESS_FILE
        echo "RewriteCond %{DOCUMENT_ROOT}/maintenance.flag -f" >> $HTACCESS_FILE
        echo "RewriteRule !^maintenance\\.html$ /maintenance.html [R=302,L]" >> $HTACCESS_FILE
        echo "Maintenance mode enabled at $(date)" >> $LOG_FILE
        echo "Maintenance mode enabled."

        # Set manual maintenance expiry to 2 hours
        if [ "$1" == "manual" ]; then
            (
                sleep 7200  # 2 hours in seconds
                disable_maintenance
            ) &
            MANUAL_TIMER_PID=$!
        fi
    fi
}

# Function to disable maintenance mode
disable_maintenance() {
    if [ -f $FLAG_FILE ]; then
        rm $FLAG_FILE
        rm $HTACCESS_FILE
        echo "Maintenance mode disabled at $(date)" >> $LOG_FILE
        echo "Maintenance mode disabled."

        # Kill the manual timer if it exists
        if [ -n "$MANUAL_TIMER_PID" ] && kill -0 "$MANUAL_TIMER_PID" 2>/dev/null; then
            kill "$MANUAL_TIMER_PID"
        fi
    fi
}

# Trap for terminating the script properly
trap "echo 'Stopping watch'; exit" SIGINT SIGTERM

# Start watching the directory for changes
inotifywait -m -e modify,create,delete,move "$WATCH_DIR" --format '%w%f' |
while read -r FILE; do
    echo "Change detected in $FILE. Enabling maintenance mode..."
    enable_maintenance

    # Cancel any existing pending disable timers and set a new one
    if [ -n "$DISABLE_TIMER_PID" ] && kill -0 "$DISABLE_TIMER_PID" 2>/dev/null; then
        kill "$DISABLE_TIMER_PID"
    fi

    # Wait for 5 minutes before disabling maintenance mode if no further changes are detected
    (
        sleep 300
        disable_maintenance
    ) &
    DISABLE_TIMER_PID=$!
done
