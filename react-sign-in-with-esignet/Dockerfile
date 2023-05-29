FROM node:20-alpine
COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build-storybook

EXPOSE 6006

CMD npm run storybook