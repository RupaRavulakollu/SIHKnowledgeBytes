const express = require('express')
const crypto = require('crypto')
const { Pool } = require('pg')
const path = require('path')
const fs = require('fs')

//-- Express --------------------------------------------------------------------------------------------------
const api = express.Router()
//-------------------------------------------------------------------------------------------------------------

//-- Body parser ----------------------------------------------------------------------------------------------
const bodyParser = require("body-parser");
api.use(bodyParser.json());
//-------------------------------------------------------------------------------------------------------------

//-- Postgres Configuration -----------------------------------------------------------------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//-------------------------------------------------------------------------------------------------------------


//-- Code begins here -----------------------------------------------------------------------------------------
function hash(input, salt) { //- Hashing Function
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pdkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

api.post('/hash', (req, res) => { //- Temporary hash endpoint
    var salt = crypto.randomBytes(128).toString('hex')
    res.send(hash(req.body.password, salt));
})

api.post('/whoami', (req, res, next) => { //- Who am I?
    if (req.session.user) {

        var user = {
            name: req.session.user.name,
            dpsuName: req.session.user.dpsu_name,
            dpsuShortName: req.session.user.dpsu_shortname,
            moderator: req.session.user.moderator,
            designation: req.session.user.designation
        }
        res.status(200).send(user)
    }
    else {
        next()
    }
}, (req, res) => {
    res.send(null)
})

api.post('/login', (req, res, next) => { //- Login
    if (req.body.email && req.body.password)
        next()
    else
        res.status(400).send({ "error": "The request body is imcomplete" })
}, (req, res) => {
    var { email, password } = req.body
    pool.query('SELECT id, password FROM users WHERE email = $1', [email], (err, results) => {
        if (err) {
            console.log(err.toString())
            res.status(500).send({ "error": "Something's Wrong" })
        }
        else {
            if (results.rows.length === 0) {
                res.status(403).send({ "error": "Wrong Credentials" })
            }
            else {
                var actualhashed = results.rows[0].password;
                var salt = actualhashed.split('$')[2];
                var givenHashed = hash(password, salt);
                if (actualhashed === givenHashed) {
                    var query = {
                        text: `SELECT auth.id, auth.name, auth.designation, auth.moderator,
                        auth.dpsu, dpsu.name as dpsu_name, dpsu.shortname as dpsu_shortname
                        FROM authors auth 
                        INNER JOIN dpsu ON dpsu.id = auth.dpsu
                        WHERE auth.id = $1`,
                        values: [results.rows[0].id]
                    }
                    pool.query(query, (err, result) => {
                        if (err) {
                            console.log("Error fetching details after login: " + err.toString())
                            res.status(500).send({ "error": "Something's Wrong" })
                        }
                        else {
                            var dbResults = result.rows[0]
                            req.session.user = dbResults
                            var user = {
                                name: dbResults.name,
                                dpsuName: dbResults.dpsu_name,
                                dpsuShortName: dbResults.dpsu_shortname,
                                moderator: dbResults.moderator,
                                designation: dbResults.designation
                            }
                            res.status(200).send(user)
                        }
                    })
                } else {
                    res.status(403).send({ "error": "Wrong Credentials" })
                }
            }
        }
    })
})

api.use((req, res, next) => { //- CHECKPOINT - No logged off user can pass this middleware
    if (req.session.user) {
        next()
    } else {
        res.status(401).send({ error: 'You have to be logged in to access this feature' })
    }
})

api.post('/logout', (req, res) => { //- Log out
    delete req.session.user
    res.status(200).send({ message: 'You\'ve been successfully logged out' })
})


api.use('/drafts', require('./routers/drafts'))
api.use('/bytes', require('./routers/bytes'))
api.use('/resources', require('./routers/resources'))

api.get('/uploads/:folder/:file', (req, res) => {
    var filePath = path.join(__dirname, 'uploads', req.params.folder, req.params.file)
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.status(404).send({ error: "File not found" })
    }
})
//-------------------------------------------------------------------------------------------------------------

module.exports = api;