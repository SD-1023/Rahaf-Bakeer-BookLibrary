import express from "express";
import "./connections/sequelizeConnection";
import {Sequelize} from 'sequelize';
import libRoutes from "./routes/library"

const app = express();



app.use("/library",libRoutes);

app.use(async (req, res, next)=>{ 

console.log("Not found")

  res.status(404).send({message:"Not Found"});
});

app.listen(3000, () => {
  console.log("Express app is listening on the port 3000!");
});
