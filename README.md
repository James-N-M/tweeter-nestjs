# Tweeter - API

URL https://tweeter-nestjs.herokuapp.com/api/

This is a backend implementation of the Tweeter - Twitter Clone challenge from [devChallenges](https://devchallenges.io/challenges/rleoQc34THclWx1cFFKH).

## What To Expect
![Swagger UI](https://user-images.githubusercontent.com/6562688/168164859-ab93a8f5-555d-4087-ac7e-53dc2f7c4fa3.png)

### Usage

Users should be able to:

- Perform http requests on available endpoints
 - locally: http://localhost:3000/api/
 - heroku: https://tweeter-nestjs.herokuapp.com/
- Clone or fork the project and run it locally
- Build your own frontend project on top of this API

### Built with

- [nestJS](https://nestjs.com/) - Node.js framework
- MYSQL
- Docker Compose 

## Installation 

1) Install Docker Desktop 
2) Copy .env.example to .env
- Leave the defaults unless your modifying the docker compose file 
3) Run npm install in the projects root 

```bash
$ npm install
```

## Running the app

```bash
# development
# will pull in mysql and run the image accessible via port 3306
$ docker-compose up 
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

Nest is [MIT licensed](LICENSE).
