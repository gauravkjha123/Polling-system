# Polling system API

This is a backend api for creating questions and adding options to a specific question. Options can be voted. Questions, options can be deleted and questions can be viewed with all of their options.


## Polling system Features

- Create questions
- Add options to question
- Delete a question
- Delete an option
- Add vote to an option
- View a question with all of its options

## Installation Guide

To install all the dependences of the project, run the following command:

    git clone https://github.com/gauravkjha123/Polling-system.git
    npm install
- Create an .env file in your project root folder and add your variables. See .env.example for assistance.
- Create database as you set in .env file for typeORM connection.
- Run  `npm run start:dev` to start the application.

## Usage

- Run  `npm run start:dev` to start the application.
- Connect to the API using Postman on port 4000.

## API Endpoints

| HTTP Verbs | Endpoints                          | Action                                 |
| ---------- | -----------------------------------| -------------------------------------- |
| POST       | /question/create                  | To create a  question                  |
| POST       | /question/:id/options/create      | To add options to a specific question  |
| DELETE     | /question/:id/delete              | To delete a question                   |
| DELETE     | /option/:id/delete                | To delete an option                    |
| PUT        | /option/:id/add_vote              | To increase the count of votes         |
| GET        | /question/:id                     | To view a question and its options     |

## Tech stack
* NodeJS
* NestJs
* ExpressJS
* MYSQL
* TypeORM 