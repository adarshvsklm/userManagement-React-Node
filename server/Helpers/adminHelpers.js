const mongoose = require('mongoose')
const db = mongoose.connection
const Admin = require('../models/admin.models')
const User = require('../models/user.model')
const ObjectId = mongoose.Types.ObjectId


module.exports = {
    UsersList: () => {
        return new Promise(async (resolve, reject) => {
            const users = await User.find({})

            console.log(users);
            resolve(users)
        })
    },
    editUser: (user) => {
        console.log(user);
        return new Promise(async (resolve, reject) => {
            User.updateOne(
                { _id: ObjectId(user.id) },
                {
                    $set: {
                        name: user.name,
                        email: user.email
                    }
                }
            ).then((response) => {
                if (response.matchedCount) {
                    resolve({ status: 200 })
                } else {
                    resolve({ status: 400 })
                }
            })



        })
    },
    deleteUser: (id) => {
        return new Promise(async (resolve, reject) => {
              User.remove(
                { _id: ObjectId(id) }
            ).then((res)=>{
                console.log(res);
                if(res.deletedCount){
                    resolve({status:200})
                }else{
                    resolve({status:400})
                }
            })
        })
    }
}