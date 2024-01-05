import {
  Sequelize,
  DataType,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  HasMany,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";
import { IComment } from "../interfaces/objInterfaces";
import Book from "./Book";
import User from "./User";

@Table({
  timestamps: false,
  tableName: "comment",
  modelName: "Comment",
})
class Comment extends Model<IComment> implements IComment {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  declare comment_id?: number;


  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    onDelete: "CASCADE",
  })
  declare user_id: number;
  
  @BelongsTo(() => User, { foreignKey: "user_id", onDelete: "CASCADE" })
  declare User: User;
  

  @AllowNull(false)
  @Column({
    type: DataType.STRING(1024),
  })
  declare comment: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare stars?: number;

  @AllowNull(false)
  @ForeignKey(() => Book)
  @Column({
    type: DataType.INTEGER,
    onDelete: "CASCADE",
  })
  declare book_id: number;

  @BelongsTo(() => Book, { foreignKey: "book_id", onDelete: "CASCADE" })
  declare Book: Book;
}

export default Comment;
