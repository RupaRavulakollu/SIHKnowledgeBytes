const express = require('express')
const { Pool } = require('pg')

//-- Express --------------------------------------------------------------------------------------------------
const bid = express.Router()
//-------------------------------------------------------------------------------------------------------------

//-- Body parser ----------------------------------------------------------------------------------------------
const bodyParser = require("body-parser");
bid.use(bodyParser.json());
//-------------------------------------------------------------------------------------------------------------

//-- Postgres Configuration -----------------------------------------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//-------------------------------------------------------------------------------------------------------------

//-- Code begins here -----------------------------------------------------------------------------------------
bid.post('/:id', (req, res, next) => {
    if(!req.body.price) res.status(400).send({error: "The request body is incomplete"})
    else next()
}, (req, res, next) => {
    let query = {
        text: `with b as (select max(price) as max from bids
                where resource=$1
                group by resource)
                select * from b
                union all
                select base_price from resources
                where id=$1 and not exists (select * from b)`,
        values: [req.params.id],
    }
    pool.query(query, (err, result) => {
        if(err) {
            console.log("Error validating bid: ", err)
            res.status(500).send({error: "Couldn't validate your bid"})
        }
        else {
            if(req.params.price > result.rows[0].max) next()
            else res.send(403).send({error: "You can't bid lower than the maximum bid/base price"})
        }
    })
}, (req, res) => {
    let query = {
        text: `with b as (
                    insert into bids (price, resource, dpsu)
                    values($1, $2, $3) returning *
                )
                select b.id, b.price, b.resource, b.bidded_on,
                json_build_object('name', dpsu.name, 'shortname', dpsu.shortname) as dpsu
                from b
                inner join dpsu on dpsu.id = b.dpsu
                `,
        values: [req.body.price, req.params.id, req.session.user.dpsu],
    }
    pool.query(query, (err, result) => {
        if(err) {
            console.log("Error posting bid: ", err)
            res.status(500).send({error: "Couldn't bid your price"})
        }
        else {
            res.send(result.rows[0])
        }
    })
})

bid.get('/:id', (req, res) => {
    var query = {
        text: `select b.id, b.price, b.resource, b.bidded_on,
                json_build_object('name', dpsu.name, 'shortname', dpsu.shortname) as dpsu
                from bids b
                inner join dpsu on dpsu.id = b.dpsu
                where b.resource = $1
                order by price desc`,
        values: [req.params.id],
    }
    pool.query(query, (err, result) => {
        if(err) {
            console.log("Error getting bid: ", err)
            res.status(500).send({error: "Couldn't get the bids"})
        }
        else {
            if(result.rowCount === 0) res.status(404).send({error: 'The resource is not found'})
            else res.send(result.rows)
        }
    })
})
//-------------------------------------------------------------------------------------------------------------

module.exports = bid