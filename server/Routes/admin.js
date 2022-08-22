let express = require('express')
let router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const db = mongoose.connection
const Admin = require('../models/admin.models')

const adminHelpers=require('../Helpers/adminHelpers')



 
router.post('/login', async (req, res) => {
    console.log(req.body);
    const admin = await Admin.findOne({
        email: req.body.email,
    })  

    if (!admin) {
        return res.json({ status: 'error', error: "Invalid Login" })
    }

    const isValid = await bcrypt.compare(req.body.password, admin.password)

    if (isValid) {
        const Admintoken = jwt.sign(
            {
                name: admin.name,
                email: admin.email
            },
            'secret123'
        )
        return res.json({ status: 'ok', admin: Admintoken })
    } else {  
        return res.json({ status: 'error', admin: false })
    }

})


router.get('/users/list',(req,res)=>{
    adminHelpers.UsersList().then((response)=>{
        console.log(response);
        return res.json({users:response})
    })
})
  

router.post('/user/edit',(req,res)=>{
    console.log(req.body);
    adminHelpers.editUser(req.body).then((response)=>{
        return res.json(response)
    })
})

router.get('/user/delete/:id',(req,res)=>{
    adminHelpers.deleteUser(req.params.id).then((response)=>{
        return res.json(response)
    })
 })


 



module.exports = router;
