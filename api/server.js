const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const sessionConfig = {
  name: 'monkey',//default is sid
  secret: 'This is not a secret',
  cookie: {
    maxAge: 1000 * 60 * 60, // = 1h
    secure: false, // false during dev, true during production
    httpOnly: true // so javascript wont have access to the cookie, only the browser
  },
  resave: false, //keep it false to avoid recreating sessions that have not changed
  saveUninitialized: false, //GDPR laws require that you ask the user's permission to add the cookie
  store: new KnexSessionStore({
    knex: require('../database/dbConfig'), //Configure instance of knex
    tablename: 'sessions', //table that will store sessions inside the db, name it anything
    sidfieldname: 'sid', // column that will hold the session id
    createtable: true, // if the table doesn't exist, it will create it automatically
    clearInterval: 1000 * 60 * 60 // sets time to check an inactive session and removes it from the db
  })
}

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
