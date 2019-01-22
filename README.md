[![Build Status](https://travis-ci.com/emrys8/questioner-api.svg?branch=develop)](https://travis-ci.com/emrys8/questioner-api) [![Coverage Status](https://coveralls.io/repos/github/emrys8/questioner-api/badge.svg?branch=develop)](https://coveralls.io/github/emrys8/questioner-api?branch=develop)


# Questioner

Questioner is a question crowdsourcing tool that provides support for meetup organizers, with features that help them prioritize questions asked by potential attendees.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

1. Clone repo: `git clone git@github.com:emrys8/questioner-api.git`
2. Install project dependencies: `npm install` or `yarn install` if using yarn
3. Setup the following environment variables
  * development:
    * DB_USER
    * DB_PASSWORD
    * DB_DEV

  * test
    * DB_USER
    * DB_PASSWORD
    * DB_TEST

4. Start the server: `npm run dev:start`
5. Launch Postman and test all endpoints

### Prerequisites

You need the following to use the **Questioner** API:
* [Node.js](https://nodejs.org/en/download/) 6 and above
* [Postman Native](https://www.getpostman.com/downloads/) or [Postman Chrome Extension](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)
* A locally installed [PostgreSQL Database server](https://www.postgresql.org/download/) (version 9+)
* [Git](https://git-scm.com/downloads)

### Installing

1. Install the project dependencies

```npm install```

2. Add project-specific environment variables:
  * development:
    * DB_USER
    * DB_PASSWORD
    * DB_DEV

  * test
    * DB_USER
    * DB_PASSWORD
    * DB_TEST

  #### Ways to set your environment variables 

  ##### Approach 1 (from the command line)

  ###### Unix (Mac or Linux variants)
  * `export DB_USER=myuser`

  ###### Windows
  * Please refer [here](https://www.computerhope.com/issues/ch000549.htm) to enable you set environment variables for your windows environment

  ##### Approach 2
  * Create a .env file in the project root
    `touch .env`
  * Add all the variables. For example:
    DB_USER=my_db_user

3. Ensure your PostgreSQL server is running
  #### Unix
  * `/usr/sbin/service postgresql status`

  #### Windows
  * Using the [pgAdmin](https://www.pgadmin.org/download/) application, you can verify if your server is running

4. Start the application server
  `npm run start:dev`
  By default, the server starts listening on port 9999.
  You can change this by setting the server to listen on another port
  ```PORT=<port-number> npm run dev:start```


#### To get the list of all meetups, you can do the following:
1. Launch Postman
2. Add the endpoint to the request box: localhost:9999/api/v1/meetups/
3. Set the request method to 'GET' and send the request

## Running the tests
1. Setup the following test environment variables:
  * DB_USER=db_test_user
  * DB_PASSWORD=db_test_password
  * DB_TEST=db_test_name

2. Run `npm test`

## Deployment

## Built With

* [Express](http://expressjs.com/) - The web framework used
* [Cloudinary](https://cloudinary.com) - Image/Video Cloud upload service

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/) for details on our code of conduct, and the process for submitting pull requests to us.

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

