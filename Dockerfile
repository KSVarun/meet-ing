FROM node:11-alpine as builder
WORKDIR /usr/app/gmeet
COPY ./ ./
RUN npm install --silent
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/gmeet/build /usr/share/nginx/html
