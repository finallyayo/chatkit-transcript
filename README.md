# Chat Transcripts with Chatkit and Sendgrid

Send chat transcripts to an email address. Tutorial:

## Getting Started

1. Clone this repository and `cd` into it.
2. Execute `npm install` to download dependencies.
3. See tutorial for notes on how to get the required credentials from Chatkit and Sendgrid.
4. Open `frontend/src/methods.js` and update it with your Chatkit credentials.
5. Rename `.env.example` to `.env` and update it with your Chatkit and Sendgrid
   credentials.
6. Run `node server.js` from the project root to start the Express server.
7. `cd` into th `frontend` directory and run `npm install` followed by `npm start` to start the development server. View http://localhost:3000 in your browser.

## Pre-requisites

- [Node.js](https://nodejs.org/en) and npm

## Built With

- [React](https://reactjs.org) - For creating the application frontend
- [Chatkit](https://pusher.com/chatkit) - Chat features
- [SendGrid](https://sendgrid.com) - Email delivery

## Licence

[MIT](https://opensource.org/licenses/MIT)

