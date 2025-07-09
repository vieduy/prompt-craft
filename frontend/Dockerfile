FROM node:20-slim

WORKDIR /app

# Enable Corepack and prepare Yarn 4
RUN corepack enable && corepack prepare yarn@4.0.2 --activate

COPY package.json yarn.lock .pnp.cjs .pnp.loader.mjs ./
COPY .yarn/ .yarn/
COPY . ./

RUN yarn install --immutable

EXPOSE 5173

CMD ["yarn", "dev", "--host", "0.0.0.0"] 