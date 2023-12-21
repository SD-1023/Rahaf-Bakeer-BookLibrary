import DBAction from "../interfaces/classInterface";
import { IBook, IComment, IPublisher } from "../interfaces/objInterfaces";
import Book from "../models/Book";
import { appCache, getCacheValue } from "../appCache";
import { number } from "yup";
import Publisher from "../models/publisher";
import Comment from "../models/Comment";
import { Sequelize } from "sequelize-typescript";

export default class CBook implements DBAction<IBook> {
  async addEntities(data: IBook): Promise<IBook> {
    try {
      const dataAdded = await Book.create(data);
      return dataAdded.toJSON();
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async updateEntities(
    updateValue: Object,
    conditionKey: string,
    conditionValue: string | number
  ): Promise<number> {
    try {
      const [updatedData] = await Book.update(updateValue, {
        where: {
          [conditionKey as keyof IBook]: conditionValue,
        },
      });

      if (updatedData !== 0) {
        await this.getEntities(undefined, true);
      }

      return updatedData;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async getEntities(dataToFind?: Object, updated?: boolean): Promise<IBook[]> {
    try {
      let booksData;
      booksData = getCacheValue("AllBooks");
      if (booksData && !updated) {
        return booksData as IBook[];
      } else {
        if (updated) {
          appCache.del("BookByID");
        }
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
    conditionKey: string,
    conditionValue: string | number
  ): Promise<boolean> {
    try {
      const book = await Book.findByPk(conditionValue);
      await book?.destroy();
      if (book) {
        const books = await this.getEntities(undefined, true);
        return true;
      } else {
        return false;
      }
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
}
