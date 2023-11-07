FROM woshiaotian/nginx:v1.12

COPY ./docker_build/default.template /etc/nginx/conf.d/
COPY ./dist/  /usr/share/nginx/html/chat

COPY ./docker_build/init.sh /usr/share/nginx/html/
CMD /bin/bash -c "/usr/share/nginx/html/init.sh && exec nginx -g 'daemon off;'"
