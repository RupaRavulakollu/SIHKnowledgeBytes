const express = require('express')
const { Pool } = require('pg')

//-- Express --------------------------------------------------------------------------------------------------
const drafts = express.Router()
//-------------------------------------------------------------------------------------------------------------

//-- Body parser ----------------------------------------------------------------------------------------------
const bodyParser = require("body-parser");
drafts.use(bodyParser.json());
//-------------------------------------------------------------------------------------------------------------

//-- Postgres Configuration -----------------------------------------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//-------------------------------------------------------------------------------------------------------------

//-- File Upload -----------------------------------------------------------------------------------
const multer = require('multer')
const fs = require('fs')
const rimraf = require('rimraf')
var storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        cb(null, `./uploads/${req.body.id.split('-').join('_')}`)
    },
    filename: (_req, file, cb) => {
        cb(null, getFilename(file.originalname))
    }
})

function getFilename(originalname) {
    var ext = originalname.substr(originalname.lastIndexOf('.') + 1)
    // Decide prefix
    var prefix = ext.toUpperCase()

    // Get date
    var d = new Date();
    var date = [d.getFullYear(), d.getMonth().toString().padStart(2, 0), d.getDate().toString().padStart(2, 0)].join('')
    var time = [d.getHours().toString().padStart(2, 0), d.getMinutes().toString().padStart(2, 0), d.getSeconds().toString().padStart(2, 0)].join('')
    return [prefix, date, time].join("_").concat(".", ext)
}

//-------------------------------------------------------------------------------------------------------------

//-- Code begins here -----------------------------------------------------------------------------------------
drafts.get('/', (req, res) => { //Get all drafts
    var query = {
        text: `select d.id, d.title, d.content from drafts d where d.author = $1`,
        values: [req.session.user.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error getting drafts: ", err)
            res.status(500).send({ error: "Couldn't get your drafts" })
        }
        else {
            res.send(result.rows)
        }
    })
})

drafts.get('/:id', (req, res) => { //Get specific draft
    var query = {
        text: `select d.id, d.title, d.content from drafts d where d.author = $1 and d.id = $2`,
        values: [req.session.user.id, req.params.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error getting drafts: ", err)
            res.status(500).send({ error: "Couldn't get your drafts" })
        }
        else {
            if (result.rows.length === 0)
                res.status(404).send({ error: "The requested draft isn't found" })
            else
                res.send(result.rows[0])
        }
    })
})

drafts.post('/', (req, res) => {//Insert new Draft
    var query = {
        text: `insert into drafts (author, dpsu) values($1, $2) returning id`,
        values: [req.session.user.id, req.session.user.dpsu],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error creating draft: ", err)
            res.status(500).send({ error: "Couldn't initialize the byte" })
        }
        else {
            var id = result.rows[0].id
            fs.mkdir(`./uploads/${id.split('-').join('_')}`, err => {
                if (err) {
                    console.log("Error creating directory for new byte: ", err)
                    pool.query('delete from drafts where id=$1', [id], (err, _) => {
                        if (err) console.log("Error deleting drafts on file creation error: ", err)
                    })
                    res.status(500).send({ error: 'Couldn\'t create a resource folder' })
                }
            })
            res.send({ id: id })
        }
    })
})

drafts.put('/', (req, res, next) => { //Update existing Draft
    if (!req.body.id || !req.body.title || !req.body.content)
        res.status(400).send({ error: "The request body is incomplete" })
    else next()
}, (req, res) => {
    var query = {
        text: `update drafts set title=$1, content=$2 where id=$3 and author=$4 returning *`,
        values: [req.body.title, req.body.content, req.body.id, req.session.user.id],
    }
    pool.query(query, (err, result) => {
        if (err) {
            console.log("Error updating draft: ", err)
            res.status(500).send({ error: "Couldn't save your draft" })
        }
        else {
            if (result.rows.length === 0)
                res.status(404).send({ error: "The requested draft isn't found" })
            else
                res.send({ id: result.rows[0].id })
        }
    })
})

drafts.put('/file', (req, res) => { //Upload file to a draft
    var upload = multer({ storage: storage }).single('file')
    upload(req, res, function (err) {
        if (err) {
            console.log("Error uploading file: ", err)
            return res.status(500).send({ error: "Couldn't upload your file" });
        }
        else res.send({ url: `/api/uploads/${req.body.id.split('-').join('_')}/${res.req.file.filename}` })
    })
})

drafts.delete('/:id', (req, res, next) => { //Discard a draft
    if (!req.params.id) res.status(400).send({ error: 'The request parameter is missing' })
    else next()
}, (req, res) => {
    pool.query('delete from drafts where id=$1 and author=$2 returning id', [req.params.id, req.session.user.id], (err, result) => {
        if (err) {
            console.log("Error deleting drafts on file creation error: ", err)
            res.status(500).send({ error: "Couldn't discard your draft" })
        }
        else {
            if (result.rows.length === 0)
                res.status(404).send({ error: "The requested draft isn't found" })
            else {
                var id = result.rows[0].id
                rimraf(`./uploads/${id.split('-').join('_')}`, (err) => {
                    if (err) console.log("Error deleting directory", err)
                })
                res.sendStatus(200)
            }
        }
    })
})

drafts.post('/publish', (req, res, next) => { //Publish the draft as article
    if (!req.body.id)
        res.status(400).send({ error: "The request body is incomplete" })
    else next()
}, (req, res, next) => { //Check authenticity
    pool.query('select author from drafts where id=$1', [req.body.id], (err, result) => {
        if(err) {
            console.log("Error authorizing draft publish: ", err)
            res.status(500).send({error: 'Couldn\'t authorize your request'})
        }
        else {
            if (result.rows.length === 0)
                res.status(404).send({ error: "The requested draft isn't found" })
            else if(result.rows[0].author !== req.session.user.id)
                res.status(403).send({error: "You aren't authorized to publish this draft"})
            else next()
        }
    })
}, (req, res) => { //Publish
    var query = {
        text: `with article as (
                    insert into articles (id, title, content, author, dpsu)
                    select id, title, content, author, dpsu from drafts
                    where id = $1
                    returning id
                ), draft as (delete from drafts where id=(select id from article))
                select id from article;`,
        values: [req.body.id],
    }
    pool.query(query, (err, result) => {
        if(err) {
            console.log("Error publishing article: ", err)
            res.status(500).send({error: "Couldn\'t publish your article"})
        }
        else {
            res.send(result.rows[0])
        }
    })
})
//-------------------------------------------------------------------------------------------------------------

module.exports = drafts