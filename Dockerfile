# Etapa de construcción
FROM node:20.14.0 AS build

WORKDIR /usr/src/pangeaco-ops-geosolution

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiamos los archivos construidos
COPY --from=build /usr/src/pangeaco-ops-geosolution/dist /usr/share/nginx/html

# Copiamos configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto y ejecutamos Nginx
EXPOSE 4033
CMD ["nginx", "-g", "daemon off;"]