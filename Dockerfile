FROM nginx:1.27-alpine
COPY preview/ /usr/share/nginx/html/
COPY app/ /usr/share/nginx/html/app/
EXPOSE 80
