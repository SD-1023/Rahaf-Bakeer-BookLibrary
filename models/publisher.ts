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
  AllowNull,
} from "sequelize-typescript";
import { IPublisher } from "../interfaces/objInterfaces";
import Book from "./Book";

@Table({
  timestamps: false,
  tableName: "publisher",
  modelName: "Publisher",
})
class Publisher extends Model<IPublisher> implements IPublisher {
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare publisher_id?: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(1024),
  })
  declare name: string;

  @Column({
    type: DataType.STRING(1024),
  })
  declare country?: string;

  @HasMany(() => Book, { foreignKey: "publisher_id" })
  declare Book: Book[];
}

export default Publisher;
