FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM pierrezemb/gostatic
COPY --from=build /app/dist /srv
EXPOSE 3000
CMD ["-port", "3000"]
