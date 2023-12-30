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
} from "sequelize-typescript";
import { IBook } from "../interfaces/objInterfaces";
import Publisher from "./publisher";
import Comment from "./Comment";


@Table({
  timestamps: false,
  tableName: "book",
  modelName: "Book",
})
class Book extends Model<IBook> implements IBook {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare book_id?: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare title: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.BIGINT,
  })
  declare isbn: number;

  @AllowNull(false)
  @ForeignKey(() => Publisher)
  @Column({
    type: DataType.INTEGER,
  })
  declare publisher_id: number;

  @BelongsTo(() => Publisher, { foreignKey: "publisher_id" })
  Publisher: Publisher;

  @Column({
    type: DataType.INTEGER,
  })
  declare pages?: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare year?: number;

  @Column({
    type: DataType.STRING(100),
  })
  declare author?: string;

  @HasMany(() => Comment, {
    foreignKey: "book_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  })
  declare Comment: Comment[];

}

export default Book;
