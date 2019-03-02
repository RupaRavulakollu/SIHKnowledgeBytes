const express = require('express')
const { Pool } = require('pg')

//-- Express --------------------------------------------------------------------------------------------------
const byte = express.Router()
//-------------------------------------------------------------------------------------------------------------

//-- Body parser ----------------------------------------------------------------------------------------------
const bodyParser = require("body-parser");
byte.use(bodyParser.json());
//-------------------------------------------------------------------------------------------------------------

//-- Postgres Configuration -----------------------------------------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//-------------------------------------------------------------------------------------------------------------

//-- Code begins here -----------------------------------------------------------------------------------------
byte.get('/:id', (req, res, next) => {
    if(!req.params.id) res.status(400).send({error: "The requeest parameter is missing"})
    else next()
}, (req, res) => {
    pool.query('select * from articles where id=$1', [req.params.id], (err, result) => {
        if(err) {
            console.log("Error getting byte: ", err)
            res.status(500).send({error: "Couldn't get the byte"})
        }
        else {
            res.send(result.rows[0])
        }
    })
})
//-------------------------------------------------------------------------------------------------------------