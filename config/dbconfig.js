const  mongoose  = require("mongoose")
const config = require("config");

exports.connectdb = ()=>{
    mongoose
  .connect(config.get("db.address"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>console.log(`db connected.`) )
  .catch((error) => debug("Error: ", error.message));
}