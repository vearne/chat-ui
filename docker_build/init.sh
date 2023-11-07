#!/bin/sh
### Modify nginx configuration
envsubst '${API_HOST}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf
