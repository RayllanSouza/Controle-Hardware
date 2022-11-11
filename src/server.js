const express = require('express');
const {json} = require('express');
const routes = require('./Routes/Routes');
const cors = require('cors');
const app = express();
app.use(json());
app.use(cors());
app.use(routes);
app.listen(2000, ()=>{console.log("Servidor online! Porta:",2000)})

module.exports = app;