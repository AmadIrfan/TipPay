const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
// mongoose.set('debug', true)
const url = process.env.MONGO_URL;


// @ts-ignore
mongoose.connect(url);

const db = mongoose.connection;

db.on("error", (err) => {
    console.log("ERROR --> ", err.message);
});
db.once("open", () => {
    console.log("connected with MONGO DB");
});  
