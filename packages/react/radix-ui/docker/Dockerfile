FROM node:20-bookworm

ENV NODE_EXTRA_CA_CERTS="/usr/local/share/ca-certificates/samsungsemi-prx.crt"
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV PNPM_HOME="/pnpm"
ENV HOME="/root"

COPY setup/ /setup
RUN /setup/init.sh
RUN npm install -g pnpm --force

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
RUN pnpm exec playwright install chromium-headless-shell --with-deps
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* /tmp/* && apt-get clean
RUN pnpm store prune --force

RUN chmod -R 777 /app && chmod 755 /root

#ENTRYPOINT ["pnpm", "playwright"]
