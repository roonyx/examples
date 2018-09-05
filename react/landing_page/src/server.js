/* eslint no-bitwise: ["error", { "allow": ["<<", "&"] }] */
const express = require('express');
const path = require('path');
const next = require('next');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
const { i18nInstance } = require('./i18n');

const {
  NAME_FIELD,
  EMAIL_FIELD,
  PHONE_FIELD,
  MESSAGE_FIELD,
  EMPTY_FIELD,
} = require('./constants/inputConstants');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use SSL
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

const FIELDS_FOR_CHECK = [NAME_FIELD, EMAIL_FIELD, PHONE_FIELD, MESSAGE_FIELD];
const getHash = (s) => s.split('').reduce((a, b) => {
  let hash = a;
  hash = ((hash << 5) - hash) + b.charCodeAt(0);
  return hash & hash;
}, 0);

i18nInstance
  .use(Backend)
  // .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'ru'], // preload all langages
    ns: ['common', 'main', 'projects'], // need to preload all the namespaces
    backend: {
      loadPath: path.join(__dirname, '../static/locales/{{lng}}/{{ns}}.json'),
    },
  }, () => {
    // loaded translations we can bootstrap our routes
    app.prepare()
      .then(() => {
        const server = express();

        server.use(bodyParser.json());

        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18nInstance));

        // serve locales for client
        server.use('/locales', express.static(path.join(__dirname, '../static/locales')));

        // use next.js
        server.get('*', (req, res) => handle(req, res));

        server.post('/feedback', (req, res) => {
          const { data } = req.body;
          let hash = 0;
          FIELDS_FOR_CHECK.forEach(key => hash += getHash(data[key] ? data[key].value : ''));
          if (hash !== data[EMPTY_FIELD]) {
            res.send();
          }

          const mailOptions = {
            from: req.body.data.email.value,
            to: process.env.RECIPIENT,
            subject: 'Roonyx landing feedback',
            text: `
              От: ${data[NAME_FIELD].value} \n
              Email: ${data[EMAIL_FIELD].value} \n
              Номер телефона: ${data[PHONE_FIELD].value} \n
              Текст сообщения: \n${data[MESSAGE_FIELD].value}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`Email sent: ${info.response}`);
            }
          });

          res.send();
        });

        server.listen(port, err => {
          if (err) {
            throw err;
          }

          console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line
        });
      });
  });
