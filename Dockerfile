FROM nginx:alpine

COPY favicon.ico /moira-web/
COPY docker/nginx.conf /etc/nginx/conf.d/moira.conf
COPY dist/ /moira-web/
COPY config.json.example /moira-web/config.json

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENV MOIRA_API_URI localhost:8081

ENTRYPOINT ["/entrypoint.sh"]
