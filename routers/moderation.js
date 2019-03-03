const express = require('express')
const { Pool } = require('pg')

//-- Express --------------------------------------------------------------------------------------------------
const moderation = express.Router()
//-------------------------------------------------------------------------------------------------------------

//-- Body parser ----------------------------------------------------------------------------------------------
const bodyParser = require("body-parser");
moderation.use(bodyParser.json());
//-------------------------------------------------------------------------------------------------------------

//-- Postgres Configuration -----------------------------------------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//-------------------------------------------------------------------------------------------------------------

//-- Code begins here -----------------------------------------------------------------------------------------
moderation.use((req, res, next) => {
    if(req.session.user.moderator) next()
    else res.status(403).send({error: "You're not authorized to access this feature"})
})

moderation.get('/', (req, res) => {
    var query = {
        text: `select art.id, art.title, art.description, art.posted_on as date, art.state,
        json_build_object('name', auth.name, 'dpsu', dpsu.name) as author
        from articles art
        inner join authors auth on auth.id = art.author
        inner join dpsu on dpsu.id = auth.dpsu
        where art.dpsu=$1 and art.state='pending'
        order by art.posted_on`,
        values: [req.session.user.dpsu],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error getting my bytes: ", err)
            res.status(500).send({ error: "Couldn't get your bytes" })
        }
        else {
            res.send(result.rows)
        }
    })
})

moderation.post("/:id/decision", (req, res, next) => {
    if(!req.body.decision || !['live', 'rejected'].includes(req.body.decision)) res.status(400).send({error: 'The request body is invalid'})
    else next()
}, (req, res) => {
    console.log(req.body.decision)
    var query = {
        text: `update articles set state = $1, moderated_by = $2 where id=$3`,
        values: [req.body.decision, req.session.user.id, req.params.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error posting decision: ", err)
            res.status(500).send({ error: "Couldn't apply your decision" })
        }
        else {
            res.sendStatus(200)
        }
    })
})

moderation.get('/:id', (req, res) => {
    var query = {
        text: `select art.id, art.title, art.description, art.content, art.posted_on as date,
        json_build_object('name', auth.name, 'dpsu', dpsu.name) as author
        from articles art
        inner join authors auth on auth.id = art.author
        inner join dpsu dpsu on dpsu.id = auth.dpsu
        where art.id=$1 and art.state='pending'`,
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

module.exports = moderation