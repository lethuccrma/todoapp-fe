# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets
FROM node:14-alpine AS build

ARG ENV

# Set working directory
WORKDIR /app

ENV NODE_ENV=$ENV

# Copy all files from current directory to working dir in image
COPY . .
# install node modules
RUN yarn install
# Build 
RUN yarn build

# nginx state for serving content
FROM nginx:stable-alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*

# Copy build
COPY --from=build /app/build .
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Containers run nginx with global directives and daemon off
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
