let express=require('express')
let router = express.Router();
const cors = require('cors')
const mongoose = require('mongoose')
const db = mongoose.connection
 const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user.model')





router.get('/',(req,res)=>{
    res.send('Home')
})


router.post('/register', async (req, res) => {
      try {
        const newpassword = await bcrypt.hash(req.body.password , 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newpassword
        })
        res.json({ status: 'ok' })
    } catch (err) {
        console.log(err);

        res.json({ status: 'error', error: "Duplicate email" })
    }
    finally {
        console.log('djsdjkjdh');
    }
})


router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
     })
     if(!user){
        console.log(45657886543);

        return res.json({status :'error' , error : 'Invalid Login'})
     }

     const isUserValid = await bcrypt.compare(req.body.password,user.password)
    
     if (isUserValid) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            'secret123'
        )
        // console.log('logged in');
        return res.json({ status: 'ok', user: token ,userDetails:user})
    } else {
        return res.json({ status: 'error', user: false })

    }

})


router.get('/quote',async(req,res)=>{
    const token = req.headers['x-access-token']
    try{
        const decoded = jwt.verify(token,'secret123')
        const email = decoded.email
        const user = await User.findOne({email:email})

        return res.json({status :'ok',quote :user.quote})
    } catch(err){
        console.log(err);
        res.json({status:'error' ,error : 'invalid token'})
    }
})

router.post('/quote',async(req,res)=>{
    const token = req.headers['x-access-token']
     try {
        const decoded = jwt.verify(token,'secret123')
        const email = decoded.email
        await User.updateOne({email:email},
            {$set : {quote : req.body.quote}})

        return res.json({status:'ok'})    
        
    } catch(err){
        console.log(err);
        res.json({status:'error',error:'invalid token'})
    }
})



module.exports = router;

