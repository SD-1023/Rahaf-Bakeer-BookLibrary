import DBAction from "../interfaces/classInterface";
import { IBook, IComment } from "../interfaces/objInterfaces";
import Book from "../models/Book";
import { appCache, getCacheValue } from "../appCache";
import Comment from "../models/Comment";

export default class CComment implements DBAction<IComment> {

  
  async addEntities(data: IComment): Promise<IComment> {
    try {
      const dataAdded = await Comment.create(data);
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
      const [updatedData] = await Comment.update(updateValue, {
        where: {
          [conditionKey as keyof IComment]: conditionValue,
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

  async getEntities(
    data?: string | number | Object,
    updated?: boolean
  ): Promise<IComment | IComment[]> {
    try {
      let commentsData;
      commentsData = getCacheValue("AllComments");
      if (commentsData && !updated) {
        return commentsData as IComment[];
      } else {
        if (updated) {
          appCache.del("CommentByID");
        }
        commentsData = await Comment.findAll({
          raw: true,
        });
        appCache.set("AllComments", commentsData);
        return commentsData;
      }
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async deleteEntities(
    conditionValue: string | number
  ): Promise<boolean | void> {
    try {
      const comment = await Comment.findByPk(conditionValue);
      await comment?.destroy();
      await this.getEntities(undefined, true);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  async getEntityByID(id: number): Promise<object | IComment> {
    try {
      const cacheDataFound = getCacheValue("CommentByID");

      let commentData = cacheDataFound
        ? (cacheDataFound as Array<{
            comment: IComment;
            book: IBook;
          }>)
        : [];
      const singleComment = commentData?.filter(
        (comment) => comment?.comment?.comment_id === id
      );
      if (singleComment?.length > 0) {
        return singleComment[0];
      } else {
        const foundCommentData = await Comment.findByPk(id, {
          include: [{ model: Book, attributes: { exclude: ["comment_id"] } }],
          attributes: { exclude: ["book_id"] },
        });
        if (foundCommentData) {
          const dataToReturn = {
            comment: (({ Book, ...o }) => o)(foundCommentData.toJSON()),
            book: foundCommentData.toJSON()["Book" as keyof IComment],
          };

          commentData.push(dataToReturn as any);
          appCache.set("CommentByID", commentData);

          return dataToReturn;
        }
        return { comment: {}, books: [] as IBook[] };
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
