FROM node:14.5.0-alpine

RUN npm install -g truffle
RUN npm install -g @angular/cli
WORKDIR "app/Frontend"
COPY ./package.json .
RUN npm install
COPY setUpAndRun.sh .
RUN chmod +x setUpAndRun.sh
EXPOSE 4200
CMD ["./setUpAndRun.sh"]