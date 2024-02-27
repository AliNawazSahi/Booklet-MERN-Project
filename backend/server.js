const mongoose = require("mongoose")
const connecToMongo = () =>{

    mongoose.connect("mongodb://127.0.0.1:27017/merndb")
    .then(()=>{
        console.log("connected successfully");
    })
    .catch((error)=>{
        console.log("error",error)
    });
}

module.exports = connecToMongo;