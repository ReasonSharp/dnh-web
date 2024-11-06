FROM node:22.9.0-alpine3.20 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./angular.json ./tsconfig* .
COPY ./src ./src
RUN npm run build

FROM nginx:1.25.2
COPY --from=build /app/dist/* /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 50004
CMD [ "nginx", "-g", "daemon off;" ]
