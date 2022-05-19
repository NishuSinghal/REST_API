const jwt = require('jsonwebtoken');
const Allusers = require('../routes/authentication')
const JWT_SECRET=process.env.JWT_SECRET

const fetchuser=(req,res,next)=>{
    const token=req.header('authToken')
    if(!token){
        return res.status(404).send('Please Authenticate Using a Valid Token.')
    }
    try {
        const data=jwt.verify(token,JWT_SECRET)
            req.userId=data.userId
            next()
    } catch (error) {
        return res.status(500).send('Authentication Error')
    }
}

module.exports=fetchuser