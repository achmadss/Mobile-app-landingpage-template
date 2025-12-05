# Build assets (Node + Ruby + Jekyll)
FROM ruby:2.6

# Install Node.js 20 LTS (compatible with your Webpack setup)
RUN apt-get update && apt-get install -y curl gnupg \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs

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
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Built files are in /app/_site
# Use docker cp to extract them after build
