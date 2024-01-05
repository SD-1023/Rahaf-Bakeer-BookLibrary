import { Sequelize } from "sequelize-typescript";
import dbConfig from "../db.config";
import Book from "../models/Book";
import Publisher from "../models/publisher";
import Comment from "../models/Comment";
import User from "../models/User";
import Session from "../models/Session";
import { appCache } from "../appCache";
import CBook from "../classes/bookClass";
import CComment from "../classes/commentClass";
import CPublisher from "../classes/publisherClass";
import CUser from "../classes/userClass";



appCache.set("Book", new CBook());
appCache.set("Publisher", new CPublisher());
appCache.set("Comment", new CComment());
appCache.set("User", new CUser());

const sequelize = new Sequelize({
  database: dbConfig.DB,

  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  host: dbConfig.Host,
  port: 3306,
  dialect: "mysql",
});

sequelize.addModels([Book, Publisher, Comment,User,Session]);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    sequelize.sync();//{ alter: true , force: false }
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default {};
