# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCLAVeyX2harUteEdfVNzN1AmWAqt__HC8
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votesphere-app.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=votesphere-app
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votesphere-app.firebasestorage.app
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=602479619411
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:602479619411:web:4940917db5cde8e10b05a6
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-JWEY52N1Y1
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB46GmEvbieqngWIc7FatxUxjN3ye6TiMs
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000

RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
