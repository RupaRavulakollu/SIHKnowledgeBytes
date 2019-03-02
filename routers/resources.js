const express = require('express')
const { Pool } = require('pg')

//-- Express --------------------------------------------------------------------------------------------------
const resources = express.Router()
//-------------------------------------------------------------------------------------------------------------

//-- Body parser ----------------------------------------------------------------------------------------------
const bodyParser = require("body-parser");
resources.use(bodyParser.json());
//-------------------------------------------------------------------------------------------------------------

//-- Postgres Configuration -----------------------------------------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//-------------------------------------------------------------------------------------------------------------

//-- Code begins here -----------------------------------------------------------------------------------------
resources.get('/', (req, res) => { //Get other dpsu resources - browse
    var query = {
        text:`select r.id, r.name, r.description, r.type, r.duration, r.base_price, r.posted_on, r.deadline, r.photo,
        json_build_object('name', dpsu.name, 'shortname', dpsu.shortname) as dpsu,
        mod.name as posted_by
        from resources r
        inner join dpsu on dpsu.id = r.dpsu
        inner join authors mod on mod.id = r.posted_by
        where r.dpsu <> $1 and r.deadline > ${Date.now()}
        order by deadline`,
        values: [req.session.user.dpsu],
    }
    pool.query(query, (err, result) => {
        if(err) {
            console.log("Error getting browse resources: ", err)
            res.status(500).send({error: "Couldn't get the available resources"})
        }
        else {
            res.send(result.rows)
        }
    })
})

resources.get('/live', (req, res) => { //Get my dpsu live resources
    var query = {
        text:`select r.id, r.name, r.description, r.type, r.duration, r.base_price, r.posted_on, r.deadline, r.photo,
        json_build_object('name', dpsu.name, 'shortname', dpsu.shortname) as dpsu,
        mod.name as posted_by
        from resources r
        inner join dpsu on dpsu.id = r.dpsu
        inner join authors mod on mod.id = r.posted_by
        where r.dpsu = $1 and r.deadline > ${Date.now()}
        order by deadline`,
        values: [req.session.user.dpsu],
    }
    pool.query(query, (err, result) => {
        if(err) {
            console.log("Error getting live resources: ", err)
            res.status(500).send({error: "Couldn't get your live resources"})
        }
        else {
            res.send(result.rows)
        }
    })
})

resources.get('/closed', (req, res) => { //Get my dpsu closed resources
    var query = {
        text:`select r.id, r.name, r.description, r.type, r.duration, r.base_price, r.posted_on, r.deadline, r.photo,
        json_build_object('name', dpsu.name, 'shortname', dpsu.shortname) as dpsu,
        mod.name as posted_by
        from resources r
        inner join dpsu on dpsu.id = r.dpsu
        inner join authors mod on mod.id = r.posted_by
        where r.dpsu = $1 and r.deadline < ${Date.now()}
        order by deadline`,
        values: [req.session.user.dpsu],
    }
    pool.query(query, (err, result) => {
        if(err) {
            console.log("Error getting closed resources: ", err)
            res.status(500).send({error: "Couldn't get your closed resources"})
        }
        else {
            res.send(result.rows)
        }
    })
})

resources.post('/', (req, res, next) => { //Post new resource
    //Check body
    next()
}, (req, res) => {
    var { name, description, type, duration, basePrice, deadline } = req.body
    var me = req.session.user.id
    var myDpsu = req.session.user.dpsu
    var query = {
        text: `with newr as (insert into resources (name, description, type, duration, base_price, deadline, posted_by, dpsu)
                values($1, $2, $3, $4, $5, $6, $7, $8) returning *)
                select newr.id, newr.name, newr.description, newr.type, newr.duration, newr.base_price, newr.posted_on, newr.deadline, newr.photo,
                json_build_object('name', dpsu.name, 'shortname', dpsu.shortname) as dpsu,
                mod.name as posted_by
                from newr
                inner join dpsu on dpsu.id = newr.dpsu
                inner join authors mod on mod.id = newr.posted_by`,
        values: [name, description, type, duration, basePrice, deadline, me, myDpsu],
    }
    pool.query(query, (err, result) => {
        if(err) {
            console.log("Error posting resource: ", err)
            res.status(500).send({error: "Couldn't post the resource for bidding"})
        }
        else {
            res.send(result.rows[0])
        }
    })
})

resources.use(require('./bid.js'))
//-------------------------------------------------------------------------------------------------------------

module.exports = resources