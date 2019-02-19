const express = require('express');
const knex = require('knex');

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
}
const db = knex(knexConfig);

const router = express.Router();

router.post('', async (req, res, next) => {
    if (!req.body.name) {
      res.status(404).json({errorMessage: "Please provide a name for the bear."})
    }
    try {
      const [id]= await db('bears').insert(req.body);
      res.status(201).json({id})
    } catch (err) {
      res.status(500).json({errorMessage: "Could not create bear."})
    }
  })
  
  router.get('', async (req, res, next) => {
    try {
      const bears = await db('bears');
      res.status(200).json(bears)
    } catch(err) {
      res.status(500).json({errorMessage: "Could not fetch bears."})
    }
  })
  
  router.get('/:id', async (req, res, next) => {
    try {
      const bear = await db('bears').where({id: req.params.id}).first();
      if (!bear) {
        res.status(404).json({errorMessage: "A bear with that id does not exist."})
      } else {
        res.status(200).json(bear)
      }
    } catch(err) {
      res.status(500).json({errorMessage: "Could not get bear with that id"})
    }
  })
  
  router.delete('/:id' , async (req, res, next) => {
    try {
      const result = await db('bears').where({id: req.params.id}).del();
      if (result < 1) {
        res.status(404).json({errorMessage: "The bear with that id could not be deleted"})
      } else {
        res.status(201).json(result)
      }
    } catch (err) {
      res.status(500).json(err)
    }
  })
  
  router.put('/:id', async (req, res, next) => {
    try {
      const result = await db('bears').where({id: req.params.id}).update(req.body);
      if (!result) {
        res.status(404).json({errorMessage: "We could not update the bear."})
      } else {
        res.status(201).json(result)
      }
    } catch (err) {
      res.status(500).json({errorMessage: "We could not update the bear."})
    }
  })

module.exports = router;