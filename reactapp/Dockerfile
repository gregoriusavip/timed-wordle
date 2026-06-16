FROM node:24-slim AS base

# Set up pnpm pathing and enable corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

WORKDIR /app

# Copy lockfiles first to leverage Docker caching for faster installs
COPY package.json pnpm-lock.yaml* ./

# Install ALL dependencies (including devDependencies like Vite/React-Scripts)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY . .

EXPOSE 5173

CMD [ "pnpm", "run", "dev" ]