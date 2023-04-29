const mongoose = require("mongoose");

const connectDB = async ()=> {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    console.log(`MONGODB Connected: ${conn.connection.host}`);


}

module.exports= connectDB
