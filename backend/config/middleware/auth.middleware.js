const jwt = require('jsonwebtoken');
require('dotenv').config();
const key = process.env.SECRET_KEY;

const auth = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    try{
       jwt.verify(token,key,(err,decoded)=>{
            if(err){
                return res.status(401).json({message: 'Unauthorized'});
            }
            else{
                req.body.id = decoded.id;
                req.body.role = decoded.role;
                console.log('decoded',decoded)
                next();
            }
        })

    }catch(err){
        return res.status(401).send(err);
    }
}

module.exports = auth;
 