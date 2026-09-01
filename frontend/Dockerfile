
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./

RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
