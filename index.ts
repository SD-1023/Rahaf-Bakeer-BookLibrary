import express from "express";
// import libRoutes from "./routes/library";
import "./connections/sequelizeConnection";
import {Sequelize} from 'sequelize';
import libRoutes from "./routes/library"
// import 'reflect-metadata';

const app = express();

// app.set("view engine", "pug");
// app.use("/library",libRoutes);
console.log("Not ggggggggggggggg")
// Connection.sequelizeConnect();
// const sequelize2 = new Sequelize('DBCon', 'username', '123456', {
//     host: 'localhost',
//     dialect: 'mysql',
// });

// Connection.sequelizeConnect();

app.use("/library",libRoutes);

app.use(async (req, res, next)=>{ 

console.log("Not found")

  res.status(404).send({message:"Not Found"});
});
console.log("Not hhhhhhhhhhhhhfound")

app.listen(3000, () => {
  console.log("Express app is listening on the port 3000!");
});
