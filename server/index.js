const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

//Routers
const PostRouter = require("./routes/Posts");
app.use("/posts", PostRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server is runing on port 3001");
  });
});
