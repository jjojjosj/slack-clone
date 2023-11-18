const privateMsg = require("./privateMsg");
const groupMsg = require("./groupMsg");
const common = require("./common");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const uri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/?authSource=admin&readPreference=primary&directConnection=true&ssl=false`;
mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => console.log("Mongodb Connected..."))
  .catch((err) => console.log(err));

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

common.commoninit(io);
groupMsg.groupMsginit(io);
privateMsg.privateMsginit(io);
