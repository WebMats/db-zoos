const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();
const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
}
const db = knex(knexConfig);

server.use(express.json());
server.use(helmet());

const bearsRouter = require('./routes/bears');
server.use('/api/bears', bearsRouter);

// endpoints here

server.post('/api/zoos', async (req, res, next) => {
  if (!req.body.name) {
    res.status(404).json({errorMessage: "Please provide a name for the zoo."})
  }
  try {
    const [id] = await db('zoos').insert(req.body);
    res.status(201).json({id})
  } catch (err) {
    res.status(500).json({errorMessage: "Could not create zoo."})
  }
})

server.get('/api/zoos', async (req, res, next) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos)
  } catch(err) {
    res.status(500).json({errorMessage: "Could not fetch zoos."})
  }
})

server.get('/api/zoos/:id', async (req, res, next) => {
  try {
    const zoo = await db('zoos').where({id: req.params.id}).first();
    if (!zoo) {
      res.status(404).json({errorMessage: "A zoo with that id does not exist."})
    } else {
      res.status(200).json(zoo)
    }
  } catch(err) {
    res.status(500).json({errorMessage: "Could not get zoo with that id"})
  }
})

server.delete('/api/zoos/:id' , async (req, res, next) => {
  try {
    const result = await db('zoos').where({id: req.params.id}).del();
    if (result < 1) {
      res.status(404).json({errorMessage: "Zoo with that id could not be deleted"})
    } else {
      res.status(201).json(result)
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

server.put('/api/zoos/:id', async (req, res, next) => {
  try {
    const result = await db('zoos').where({id: req.params.id}).update(req.body);
    if (!result) {
      res.status(404).json({errorMessage: "We could not update the zoo."})
    } else {
      res.status(201).json(result)
    }
  } catch (err) {
    res.status(500).json({errorMessage: "We could not update the zoo."})
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
