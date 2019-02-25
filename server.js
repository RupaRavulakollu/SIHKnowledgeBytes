const express = require('express')
const path = require('path')


//-- Express --------------------------------------------------------------------------------------------------
const app = express()
const PORT = process.env.PORT || 8000
const server = require('http').Server(app)
//-------------------------------------------------------------------------------------------------------------

//-- Body parser ----------------------------------------------------------------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.json());
//-------------------------------------------------------------------------------------------------------------

//-- Logger ---------------------------------------------------------------------------------------------------
const morgan = require('morgan')
const cors = require('cors')
if (process.env.NODE_ENV !== 'production') {
    app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
    app.use(morgan('dev'))
}
//-------------------------------------------------------------------------------------------------------------

//-- Code start here ------------------------------------------------------------------------------------------
app.get('/api', (_req, res) => {
    res.send("Knowledge Bytes for React")
})
//-------------------------------------------------------------------------------------------------------------

//-- Heroku ---------------------------------------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function (_req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}
//-------------------------------------------------------------------------------------------------------------

server.listen(PORT, () => console.log(`Knowledge Bytes running at ${PORT}`))