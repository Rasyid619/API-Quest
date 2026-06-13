# Use Node.js v25 image as base
FROM node:25-slim AS base

# First stage: Build the app
FROM base AS builder
# Set the working directory in the container
WORKDIR /app
# Copy configuration files
COPY package.json yarn.lock .yarnrc.yml /app/
RUN npm uninstall -g yarn pnpm \
    && npm --force install -g corepack
# Install all dependencies
RUN corepack enable && yarn install --immutable
# Copy code
COPY tsconfig.json tsconfig.build.json /app/
COPY /src /app/src
# Build code
RUN yarn build

# Second stage: Run the app
FROM base
# Set the working directory in the container
WORKDIR /app
# Copy only the necessary files to run the app
COPY package.json yarn.lock .yarnrc.yml entrypoint.sh /app/
# Copy the built app from the first stage
COPY --from=builder /app/dist /app/dist
RUN npm uninstall -g yarn pnpm \
    && npm --force install -g corepack
# Install only production dependencies
RUN corepack enable && yarn workspaces focus --production
# Set environment variable
ENV NODE_ENV=production
ENTRYPOINT [ "/bin/bash", "/app/entrypoint.sh" ]
# Run the app
CMD ["yarn", "start"]
