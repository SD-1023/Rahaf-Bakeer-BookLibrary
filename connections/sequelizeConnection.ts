import { Sequelize } from "sequelize-typescript";
import dbConfig from "../db.config";
import Book from "../models/Book";
import Publisher from "../models/publisher";
import Comment from "../models/Comment";

const sequelize = new Sequelize({
  database: dbConfig.DB,

  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  host: dbConfig.Host,
  port: 3306,
  dialect: "mysql",
});

sequelize.addModels([Book, Publisher, Comment]);
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
