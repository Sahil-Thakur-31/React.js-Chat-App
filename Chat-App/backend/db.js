const mongoose = require('mongoose');

const connect = async ()=>{
    await mongoose.connect(process.env.Mongo_URI);
    console.log("MongoDB Connected!!!")
}

module.exports = connect;