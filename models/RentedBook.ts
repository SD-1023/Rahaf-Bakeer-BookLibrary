import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  ForeignKey,
  HasMany,
  AllowNull,
  Unique,
  BeforeUpdate,
  BeforeCreate,
  BelongsTo,
  Association,
  NotNull,
} from "sequelize-typescript";
import { IBook } from "../interfaces/objInterfaces";
import Publisher from "./publisher";
import Comment from "./Comment";
import User from "./User";
import Book from "./Book";

@Table({
  timestamps: false,
  tableName: "rentedbook",
  modelName: "RentedBook",
})
class RentedBook extends Model {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare rent_id?: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    onDelete: "CASCADE",
    type: DataType.INTEGER,
  })
  declare user_id: number;

  @BelongsTo(() => User, { foreignKey: "user_id" })
  User: User;

  @AllowNull(false)
  @ForeignKey(() => Book)
  @Column({
    onDelete: "CASCADE",
    type: DataType.INTEGER,
  })
  declare book_id: number;

  @BelongsTo(() => Book, { foreignKey: "book_id" })
  Book: Book;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare copies_number: number;
}

export default RentedBook;
