require('dotenv').config();
const jwt = require('jsonwebtoken');

function JwtMiddleware(req, res, next){
    var {authorization} = req.headers;
    try{
        var token = authorization.split(" ")[1];
        let decoded = jwt.verify(token, process.env.secret_key, {});
        req.headers.decoded = decoded;
        next()
    }catch(err){
        return res.status(401).json({
            Error: "Token invalid!"
        })
    }
}

function JwtVerify(req, res){
    var {authorization} = req.headers;
    try{
        var token = authorization.split(" ")[1];
        var decoded = jwt.verify(token, process.env.secret_key, {});
        return res.status(200).json(
            decoded
        )
    }catch(err){
        return res.status(401).json({
            Error: "Token Invalid!"
        })
    }
}

module.exports = {JwtMiddleware, JwtVerify};