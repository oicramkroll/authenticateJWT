const JWT = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
module.exports = (req,res,next) =>{
    const parts = req.headers.authorization.split(' ');
    const [schema,token] = parts;

    const defaultError = {error:"Invalid token authorization"};

    if((!(parts.length===2)) || (!/^Bearer$/.test(schema)))
        return res.status(401).send(defaultError);

    JWT.verify(token,authConfig.secret,(error,decoded)=>{
        if(error)
            return res.status(401).send({defaultError,error});

        req.userId = decoded.id;
        return  next();
    })

   
}