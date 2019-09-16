const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

const bcrypt = require('bcryptjs');


server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
  
  
  let user = req.body;


  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);
  
  credentials.password = hash;
  
  // move on to save the user.

  const credentials = req.body;

  // find the user in the database by it's username then
  if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
    return res.status(401).json({ error: 'Incorrect credentials' });
  }
  
  // the user is valid, continue on

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});




const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
