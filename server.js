require('dotenv').config({ path: '.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');
const dateFns = require('date-fns');

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_SECRET_KEY,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users', (req, res) => {
  const { username } = req.body;

  chatkit
    .createUser({
      id: username,
      name: username,
    })
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${username}`);
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
    });
});

app.post('/transcript', (req, res) => {
  const { roomId, email, name } = req.body;
  chatkit.fetchMultipartMessages({
    roomId,
    limit: 100,
  })
    .then(messages => {
      const t = constructTranscript(messages);

      const msg = {
        to: email,
        from: 'noreply@fictionalservice.com',
        subject: 'Chat transcript',
        html: `
          <p>Dear ${name},</p>

          <p>Thank you for taking the time to chat with us today. Below is a copy of your chat transcript for future reference.</p>

          <p><strong>Chat ${dateFns.format(new Date(), 'DD/MM/YYYY HH:mm')}</strong></p>
          <ul>
            ${t.join('')}
          </ul>

          <p>Thank you,</p>
          <p>Customer Care</p>
        `,
      };

      return sgMail.send(msg)
    })
    .then(() => {
      res.send("Success!");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occured");
    });
});

function constructTranscript(messages) {
    return messages.reverse().map(message => {
      return `
        <li className="message">
          <div>
            <span>[${dateFns.format(message.created_at, 'DD/MM/YYYY HH:mm')}]</span>
            <strong className="user-id">${message.user_id}:</strong>
            <span className="message-text">${message.parts[0].content}</span>
          </div>
        </li>
      `
    });
}

app.set('port', process.env.PORT || 5200);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

