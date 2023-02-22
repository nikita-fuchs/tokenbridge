FROM node:14.21.3-alpine3.17
RUN apk update
RUN apk add git

RUN npm install -g truffle
RUN npm install -g @angular/cli
WORKDIR "app/Frontend"
COPY ./package.json .
RUN npm install
RUN unset NODE_OPTIONS
COPY setUpAndRun.sh .
RUN chmod +x setUpAndRun.sh
EXPOSE 4200
CMD ["./setUpAndRun.sh"]