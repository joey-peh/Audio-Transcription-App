# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# Clean install dependencies
RUN npm ci --legacy-peer-deps
RUN npm install -g @angular/cli
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/transcription_ui/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]