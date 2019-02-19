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

// endpoints here

server.post('/api/zoos', async (req, res, next) => {
  try {
    const id = await db('zoos').insert(req.body);
    res.status(201).json(...id)
  } catch (err) {
    res.status(500).json(err)
  }
})

server.get('/api/zoos', async (req, res, next) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos)
  } catch(err) {
    res.status(500).json(err)
  }
})

server.get('/api/zoos/:id', async (req, res, next) => {
  try {
    const zoo = await db('zoos').where({id: req.params.id}).first();
    res.status(200).json(zoo)
  } catch(err) {
    res.status(500).json(err)
  }
})

server.delete('/api/zoos/:id' , async (req, res, next) => {
  try {
    const result = await db('zoos').where({id: req.params.id}).del();
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json(err)
  }
})

server.put('/api/zoos/:id', async (req, res, next) => {
  try {
    const result = await db('zoos').where({id: req.params.id}).update(req.body);
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json(err)
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
