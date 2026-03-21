FROM node:22.22.1-alpine3.23 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./angular.json ./tsconfig* .
COPY ./src ./src
RUN npm run build

FROM nginx:1.25.2
COPY --from=build /app/dist/dnh-web/browser/* /usr/share/nginx/html
COPY ./src/assets /usr/share/nginx/html/assets
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 50004
CMD [ "nginx", "-g", "daemon off;" ]