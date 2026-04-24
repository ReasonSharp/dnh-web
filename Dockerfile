FROM node:22.22.1-alpine3.23 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./angular.json ./tsconfig* .
COPY ./src ./src
RUN npm run build

FROM nginx:1.29.7
RUN apt update && apt install -y php-fpm php-mysql php-curl
COPY --from=build /app/dist/dnh-web/browser/* /usr/share/nginx/html
COPY ./src/assets /usr/share/nginx/html/assets
COPY ./api /usr/share/nginx/html/api
COPY nginx.conf /etc/nginx/nginx.conf
COPY www.conf /etc/php/8.4/fpm/pool.d/www.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
VOLUME ["/usr/share/nginx/html/images", "/usr/share/nginx/html/documents"]
EXPOSE 50004
CMD [ "/entrypoint.sh" ]
