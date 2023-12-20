# build stage
FROM node:20-alpine as build-stage
WORKDIR /app
COPY ./museverse .
COPY ./nginx ./nginx
RUN npm install
RUN npm run build

# production stage
FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
