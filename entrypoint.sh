#!/bin/sh

mkdir -p /usr/share/nginx/html/images /usr/share/nginx/html/documents
chown -R nginx:nginx /usr/share/nginx/html/images /usr/share/nginx/html/documents

php-fpm8.4 -D && exec nginx -g 'daemon off;'
