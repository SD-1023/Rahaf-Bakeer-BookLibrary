import DBAction from "../interfaces/classInterface";
import { IBook, IComment, IPublisher } from "../interfaces/objInterfaces";
import Book from "../models/Book";
import { appCache, getCacheValue } from "../appCache";
import Publisher from "../models/publisher";
import Comment from "../models/Comment";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import sequelizeConnection from "../connections/sequelizeConnection";
import RentedBook from "../models/RentedBook";

export default class CBook implements DBAction<IBook> {
  async addEntities(data: IBook,user_id?:number): Promise<IBook> {
    try {
      data.user_id=user_id;
      const dataAdded = await Book.create(data);
      return dataAdded.toJSON();
    } catch (e: any) {
      if (e.name === "SequelizeUniqueConstraintError") {
        throw new Error(e?.errors[0]?.message, { cause: "unique violation" });
      } else {
        throw new Error(e);
      }
    }
  }

  async updateEntities(
    updateValue: Object,
    conditionKey: string,
    conditionValue: string | number
  ): Promise<IBook | IBook[]> {
    try {
      const [updatedData] = await Book.update(updateValue, {
        where: {
          [conditionKey as keyof IBook]: conditionValue,
        },
      });
      let book;
      if (updatedData !== 0) {
        appCache.del("BookByID");
        await this.getEntities(undefined, true);
        if (conditionKey === "book_id") {
          const updatedValue = await Book.findByPk(conditionValue);
          book = updatedValue.toJSON();
        }
      }
      return book;
    } catch (e: any) {
      if (e.name === "SequelizeUniqueConstraintError") {
        throw new Error(e?.errors[0]?.message, { cause: "unique violation" });
      } else {
        throw new Error(e);
      }
    }
  }

  async getEntities(dataToFind?: Object, updated?: boolean): Promise<IBook[]> {
    try {
      let booksData;
      booksData = getCacheValue("AllBooks");
      if (booksData && !updated) {
        return booksData as IBook[];
      } else {
        booksData = await Book.findAll({
          raw: true,
        });
        appCache.set("AllBooks", booksData);
        return booksData;
      }
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async deleteEntities(
    conditionValue: string | number
  ): Promise<boolean | void> {
    try {
      const book = await Book.findByPk(conditionValue);
      await book?.destroy();
      appCache.del("BookByID");
      await this.getEntities(undefined, true);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getEntityByID(id: number): Promise<object> {
    try {
      const cacheDataFound = getCacheValue("BookByID");

      let bookData = cacheDataFound
        ? (cacheDataFound as Array<{
            book: IBook;
            comment: IComment | null;
            publisher: IPublisher | null;
          }>)
        : [];
      const singleBook = bookData?.filter((book) => book?.book?.book_id === id);
      if (singleBook?.length > 0) {
        return singleBook[0];
      } else {
        const foundBookData = await Book.findByPk(id, {
          include: [
            Publisher,
            { model: Comment, attributes: { exclude: ["book_id"] } },
          ],
          group: ["book_id", "comment_id"],
          attributes: { exclude: ["publisher_id"] },
        });
        if (foundBookData) {
          const dataToReturn = {
            book: (({ Publisher, Comment, ...o }) => o)(foundBookData.toJSON()),
            publisher: foundBookData.toJSON()["Publisher" as keyof IBook],
            comments: foundBookData.toJSON()["Comment" as keyof IBook],
          };

          bookData.push(dataToReturn as any);
          appCache.set("BookByID", bookData);

          return dataToReturn;
        }
        return { book: {}, publisher: {}, comments: [] as IComment[] };
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getRatedEntities(): Promise<Book[]> {
    try {
      const data = await Book.findAll({
        subQuery: false,
        attributes: [
          "book_id",
          "title",
          "isbn",
          "author",
          "publisher_id",
          "pages",
          "year",
          "quantity",
          [Sequelize.fn("AVG", Sequelize.col("Comment.stars")), "AVGRating"],
        ],
        include: {
          model: Comment,
          nested: true,
          attributes: [],
          where: {
            stars: {
              [Op.not]: null,
            },
          },
          required: false,
        },
        group: ["book_id"],
        order: [[Sequelize.literal("AVGRating"), "DESC"]],
        limit: 10,
      });
      return data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async rentBook(book_id:number,user_id:number,data:any): Promise<object> {
    try {
      const trans = await sequelizeConnection.sequelize.transaction();

      try {
        const book = await Book.findOne({
          where: {
            book_id: book_id,
            quantity: {
              [Op.not]: 0,
            },
          },
          transaction: trans,
        });
        if (book) {
          try {
            const rent_book = await RentedBook.create(
              {
                user_id: user_id,
                book_id: book_id,
                copies_number: data.copies_number,
              },
              { transaction: trans }
            );
            const bookInfo = book.toJSON();

            const updatedBook = await Book.update(
              { quantity: bookInfo.quantity - 1 },
              
              {
                where: {
                  book_id: book_id,
                },
                transaction:trans,
              },
            );
            const commitTrans = trans.commit();
            try {
              await Promise.all([updatedBook, commitTrans]);
              return rent_book.toJSON();
            } catch (e: any) {
              await trans.rollback();
              throw new Error(e);
            }
          } catch (e: any) {
            await trans.rollback();
            throw new Error(e);
          }
        } else {
          throw {
            message:
              "There is no book left with id = " + book_id.toString(),
          };
        }
      } catch (e: any) {
        await trans.rollback();
        throw new Error(e);
      }
    } catch (e: any) {
      throw new Error(e);
    }
  }
}
