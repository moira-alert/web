#!/bin/sh

sed -i /etc/nginx/conf.d/moira.conf -e "s|MOIRA_API_URI|$MOIRA_API_URI|"

exec nginx -g "daemon off;"
