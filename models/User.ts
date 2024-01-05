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
  IsEmail,
  Length,
  Is,
} from "sequelize-typescript";
import { IUser } from "../interfaces/objInterfaces";
import moment from "moment";
import bcrypt from "bcrypt";
import Session from "./Session";
import Comment from "./Comment";
import RentedBook from "./RentedBook";
import Book from "./Book";

@Table({
  timestamps: false,
  tableName: "user",
  modelName: "User",
})
class User extends Model<IUser> implements IUser {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare user_id?: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
  })
  declare first_name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
  })
  declare last_name: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare age?: number;

  @Column({
    type: DataType.DATEONLY,
  })
  get DOB(): string {
    return moment(this.getDataValue("DOB"), "YYYY-MM-DD").format("YYYY-MM-DD");
  }

  @Unique(true)
  @IsEmail
  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
  })
  declare email: string;

  @Length({ min: 6 })
  @Is(function passwordValidation(value: string): void {
    const checkingRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/;

    if (!checkingRegex.test(value)) {
      throw new Error("The Password validation field");
    }
  })
  @AllowNull(false)
  @Column({
    type: DataType.STRING(1000),
  })
  declare password?: string;

  @HasMany(() => Session, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  })
  declare Session: Session[];

  @HasMany(() => Comment, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  })
  declare Comment: Comment[];


  @HasMany(() => Book, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  })
  declare Book: Book[];

  @Column({
    type: DataType.INTEGER,
  })
  declare optCode?: number;

  @HasMany(() => RentedBook, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  })
  declare RentedBook: RentedBook[];

  @BeforeCreate
  static setAge(instance: User) {
    const year = new Date().getFullYear();
    instance.age = year - new Date(instance.DOB).getFullYear();
  }

  @BeforeCreate
  static passwordEncryption(instance: User) {
    try {
      const salt = bcrypt.genSaltSync(10);
      instance.password = bcrypt.hashSync(instance.password, salt);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

export default User;
