[![Build Status](https://travis-ci.com/micah-akpan/questioner-api.svg?branch=develop)](https://travis-ci.com/micah-akpan/questioner-api) [![Coverage Status](https://coveralls.io/repos/github/micah-akpan/questioner-api/badge.svg?branch=develop)](https://coveralls.io/github/micah-akpan/questioner-api?branch=develop) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Maintainability](https://api.codeclimate.com/v1/badges/ba564f3df395de3cc381/maintainability)](https://codeclimate.com/github/micah-akpan/questioner-react/maintainability)


# Questioner

Questioner is a question crowdsourcing tool that provides support for meetup organizers, with features that help them prioritize questions asked by potential attendees.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

1. Copy the git repo url [https://github.com/emrys8/questioner-api.git](https://github.com/emrys8/questioner-api.git)
2. Clone repo: `git clone <git-url>` to have a copy of the project on your local machine
3. Install project dependencies: `npm install` or `yarn install` if using yarn
4. Create a local database: take note of your user database name, password and username
5. Add a .env file and add the environment variables specified in .env-sample file
6. Start the server: `npm run dev:start`
7. Launch Postman and test the endpoints specified in the docs

### Prerequisites

You need the following to use the **Questioner** API:
* [Node.js](https://nodejs.org/en/download/) 6 and above
* [Postman Native](https://www.getpostman.com/downloads/) or [Postman Chrome Extension](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)
* A locally installed [PostgreSQL Database server](https://www.postgresql.org/download/) (version 9+)
* [Git](https://git-scm.com/downloads)

### Installing

1. Add a .env file to the project and add these project-specific environment variables to the file.
A template of the .env with the name .env-sample can be found at the project root
2. Supply all the information needed in the .env as specified in the .env-sample
3. Install the project dependencies. Run `npm install`

Now **Questioner** has been successfully installed.

## Running the app
1. Start the application server
  `npm run start:dev`
  By default, the server starts listening on port 9999.
  You can change this by setting the server to listen on another port
  ```PORT=<port-number> npm run dev:start```
2. The above step will automatically carry out migration on your database

## Running the tests
  *  Run `npm test`

## Deployment

## Built With

* [Express](http://expressjs.com/) - The web framework used
* [Cloudinary](https://cloudinary.com) - Image/Video Cloud upload service


## API Docs
  * **[Apiary](https://questionerapi.docs.apiary.io)**

## Versioning

We use [REST API versioning standard](https://www.baeldung.com/rest-versioning) for versioning.

## Authors

* **Micah Akpan** - *Initial work* - [emrys8](https://github.com/emrys8)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is authored by **Micah Akpan** ([emrys8](https://github.com/emrys8)) and is licensed to use under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Every open source contributor to all the modules used in this project (see [project metadata](package.json))
* A big appreciation to the following persons for their feedback:
  * [Victor Enogwe](https://github.com/victor-enogwe)
  * [Chima Chukwuemeka](https://github.com/chukwuemekachm)

