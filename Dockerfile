# ----------------------------
# Stage 1: Build assets (Node + Ruby + Jekyll)
# ----------------------------
FROM ruby:2.6 as builder

# Install Node.js 18 (compatible with your Webpack setup)
RUN apt-get update && apt-get install -y curl gnupg \
 && curl -fsSL https://deb.nodesource.com/setup_current.x | bash - \
 && apt-get install -y nodejs \
 && npm install -g npm@latest

# Create project directory
WORKDIR /app

# Copy dependency files first for caching
COPY package.json package-lock.json* ./
COPY Gemfile Gemfile.lock* ./

# Install Ruby deps
RUN bundle install

# Install JS deps
RUN npm install

# Copy everything else
COPY . .

# Build static files (Webpack + Jekyll)
RUN npm run build

# ----------------------------
# Stage 2: Serve using NGINX
# ----------------------------
FROM nginx:stable-alpine

# Remove default nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy built site from builder
COPY --from=builder /app/_site /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
