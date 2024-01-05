import express from "express";
import "./connections/sequelizeConnection";
import {Sequelize} from 'sequelize';
import booksRoutes from "./routes/books"
import publisherRoutes from "./routes/publisher";
import commentRoutes from "./routes/comment";
import userRoutes from "./routes/user";
const app = express();



app.use("/library/books",booksRoutes);
app.use("/library/publishers",publisherRoutes);
app.use("/library/comments",commentRoutes);
app.use("/library/users",userRoutes);

app.use(async (req, res, next)=>{ 

console.log("Not found")

  res.status(404).send({message:"Not Found"});
});

app.listen(3000, () => {
  console.log("Express app is listening on the port 3000!");
});
