const express = require('express')
const { Pool } = require('pg')

//-- Express --------------------------------------------------------------------------------------------------
const bytes = express.Router()
//-------------------------------------------------------------------------------------------------------------

//-- Body parser ----------------------------------------------------------------------------------------------
const bodyParser = require("body-parser");
bytes.use(bodyParser.json());
//-------------------------------------------------------------------------------------------------------------

//-- Postgres Configuration -----------------------------------------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//-------------------------------------------------------------------------------------------------------------
//-- Code begins here -----------------------------------------------------------------------------------------
bytes.get('/', (req, res) => {
    var query = {
        text: `select art.id, art.title, art.description, art.posted_on as date, art.tags,
        json_build_object('name', auth.name, 'dpsu', dpsu.name) as author
        from articles art
        inner join authors auth on auth.id = art.author
        inner join dpsu on dpsu.id = auth.dpsu
        where live=true`,
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error getting all the bytes: ", err)
            res.status(500).send({ error: "Couldn't get the bytes" })
        }
        else {
            res.send(result.rows)
        }
    })
})

bytes.get('/:id', (req, res, next) => {
    if (!req.params.id) res.status(400).send({ error: "The requeest parameter is missing" })
    else next()
}, (req, res) => {
    var query = {
        text: `select art.id, art.title, art.description, art.content, art.posted_on as date, art.tags,
        json_build_object('name', auth.name, 'dpsu', dpsu.name) as author
        from articles art
        inner join authors auth on auth.id = art.author
        inner join dpsu dpsu on dpsu.id = auth.dpsu
        where art.id=$1 and live=true`,
        values: [req.params.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error getting byte: ", err)
            res.status(500).send({ error: "Couldn't get the byte" })
        }
        else {
            if (result.rowCount > 0) {
                res.send(result.rows[0])
            } else {
                res.status(404).send({ error: 'Byte not found' })
            }
        }
    })
})
//-------------------------------------------------------------------------------------------------------------
module.exports = bytes