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
bytes.get('/', (req, res) => { //Get all articles
    var query = {
        text: `select art.id, art.title, art.description, art.posted_on as date,
        json_build_object('name', auth.name, 'dpsu', dpsu.name) as author
        from articles art
        inner join authors auth on auth.id = art.author
        inner join dpsu on dpsu.id = auth.dpsu
        where art.state='live'${req.query.dpsu ? ' and art.dpsu=(select id from dpsu where shortname=$1)' : ''}
        order by art.posted_on desc`,
    }
    if (req.query.dpsu) query.values = [req.query.dpsu]
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


// Comments
bytes.get('/:id/comments', (req, res) => { //Get all comments
    var query = {
        text: `select c.id, c.comment, c.posted_on, c.article,
        json_build_object('name', auth.name, 'dpsu', dpsu.shortname) as posted_by
        from comments c
        inner join authors auth on auth.id = c.posted_by
        inner join dpsu on dpsu.id = auth.dpsu
        where c.article=$1
        order by posted_on desc`,
        values: [req.params.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error getting comments: ", err)
            res.status(500).send({ error: "Couldn't get the comments for the article" })
        }
        else {
            res.send(result.rows)
        }
    })
})

bytes.post('/:id/comment', (req, res, next) => { //Post new comment
    if (!req.body.comment) res.status(400).send({ error: 'The request body is incomplete' })
    else next()
}, (req, res) => {
    var query = {
        text: `with c as(
            insert into comments (comment, posted_by, article)
            values($1, $2, $3) returning *
                )
                select c.id, c.comment, c.posted_on, c.article,
                json_build_object('name', auth.name, 'dpsu', dpsu.shortname) as posted_by
                from c
                inner join authors auth on auth.id = c.posted_by
                inner join dpsu on dpsu.id = auth.dpsu`,
        values: [req.body.comment, req.session.user.id, req.params.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error posting new comment: ", err)
            res.status(500).send({ error: "Couldn't post your comment" })
        }
        else {
            res.send(result.rows[0])
        }
    })
})

//Ratings
bytes.post('/:id/rate', (req, res, next) => { //Upsert new rating
    if (!req.body.rating) res.status(400).send({ error: 'The request body is incomplete' })
    else next()
}, (req, res) => {
    var query = {
        text: `with n as (
            insert into ratings (rating, rated_by, article)
                    values($1, $2, $3)
                    on conflict on constraint rating_pkey
                    do update set rating=$1 where ratings.rated_by=$2 and ratings.article=$3
                    returning *),
                    up as (select * from n union select * from ratings r where r.article=$3 and r.rated_by <> $2)
                    select json_build_object('count', count(up.rated_by), 'value', avg(up.rating)) as rating
                    from up
                    group by up.article`,
        values: [req.body.rating, req.session.user.id, req.params.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error posting new rating: ", err)
            res.status(500).send({ error: "Couldn't save your rating" })
        }
        else {
            res.send(result.rows[0])
        }
    })
})

bytes.get('/:id/rating', (req, res) => { //Get article rating
    var query = {
        text: `select json_build_object('count', count(r.rated_by), 'value', avg(r.rating)) as rating from ratings r
        where r.article = $1
        group by r.article`,
        values: [req.params.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error getting rating: ", err)
            res.status(500).send({ error: "Couldn't get the article rating" })
        }
        else {
            res.send(result.rows[0])
        }
    })
})

bytes.get('/:id', (req, res, next) => { //Get content of one article
    if (!req.params.id) res.status(400).send({ error: "The requeest parameter is missing" })
    else next()
}, (req, res) => {
    var query = {
        text: `select art.id, art.title, art.description, art.content, art.posted_on as date,
        json_build_object('name', auth.name, 'dpsu', dpsu.name) as author,
        r.rating
        from articles art
        inner join authors auth on auth.id = art.author
        inner join dpsu dpsu on dpsu.id = auth.dpsu
        left join ratings r on r.article=$1 and r.rated_by=$2
        where art.id=$1 and art.state='live'`,
        values: [req.params.id, req.session.user.id],
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