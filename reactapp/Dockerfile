FROM node:24-slim AS base

# Set up pnpm pathing and enable corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY . .

EXPOSE 5173

CMD [ "pnpm", "run", "dev" ]