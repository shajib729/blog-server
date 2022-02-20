const mongoose = require('mongoose')
const DB_URI = process.env.DB_URI

mongoose.connect(DB_URI).then(() => {
    console.log('Connection Successful');
}).catch((err) => {
    console.log("Failed DB connection",err);
})