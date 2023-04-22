FROM denoland/deno
WORKDIR /chesswar

# Load dependencies
COPY deps.ts deno.json deno.lock ./
RUN deno cache deps.ts

# Build
COPY web/ common/ ./
RUN deno task build

# Run
CMD deno task web
