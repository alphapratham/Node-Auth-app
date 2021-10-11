const jwt = require('jsonwebtoken');

const requireAuth = (req,res,next)=>{

    const token =req.cookies.jwt;

    // check it exits
    if(token){
        jwt.verify(token,'hello alpha',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next();
            }
        })
    }
    else{
        res.redirect('/login')
    }
    
}

module.exports = { requireAuth };