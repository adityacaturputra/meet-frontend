FROM node:16.16-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm i -g vite
#COPY .yarn ./.yarn
COPY .yarnrc.yml .
RUN yarn install
COPY . .

ENV VITE_ZOOM_VIDEO_SDK_KEY=cMUg4M8Bbd8kjdqMZN23cb5tcfb5Apv7Pv1z
ENV VITE_ZOOM_VIDEO_SDK_SECRET=sORvy2gMCm6POvBtWkJM1tysILthc1Df1uGl
ENV VITE_SSO_URL=https://sso-dev.smartkmsystem.com
ENV VITE_KMS_URL=https://kms-dev.smartkmsystem.com
ENV VITE_LMS_URL=https://lms-dev.smartkmsystem.com
ENV VITE_TMS_URL=https://tms-dev.smartkmsystem.com

RUN yarn build

##CMD ["yarn", "start"]

FROM nginx:stable-alpine AS server
COPY ./etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/dist /usr/share/nginx/html
EXPOSE 3004
CMD ["nginx", "-g", "daemon off;"]
