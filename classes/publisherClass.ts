import DBAction from "../interfaces/classInterface";
import { IBook, IPublisher } from "../interfaces/objInterfaces";
import Book from "../models/Book";
import { appCache, getCacheValue } from "../appCache";
import Publisher from "../models/publisher";

export default class CPublisher implements DBAction<IPublisher> {
  async addEntities(data: IPublisher): Promise<IPublisher> {
    try {
      const dataAdded = await Publisher.create(data);
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
      const [updatedData] = await Publisher.update(updateValue, {
        where: {
          [conditionKey as keyof IPublisher]: conditionValue,
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
  ): Promise<IPublisher | IPublisher[]> {
    try {
      let publisherData;
      publisherData = getCacheValue("AllPublisher");
      if (publisherData && !updated) {
        return publisherData as IPublisher[];
      } else {
        if (updated) {
          appCache.del("PublisherByID");
        }
        publisherData = await Publisher.findAll({
          raw: true,
        });
        appCache.set("AllPublisher", publisherData);
        return publisherData;
      }
    } catch (e: any) {
      throw new Error(e);
    }
  }
  async deleteEntities(
    conditionValue: string | number
  ): Promise<boolean | void> {
    try {
      const publisher = await Publisher.findByPk(conditionValue);
      await publisher?.destroy();
      await this.getEntities(undefined, true);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getEntityByID(id: number): Promise<object | IPublisher> {
    try {
      const cacheDataFound = getCacheValue("PublisherByID");

      let publisherData = cacheDataFound
        ? (cacheDataFound as Array<{
            publisher: IPublisher;
            book: IBook | null;
          }>)
        : [];
      const singlePublisher = publisherData?.filter(
        (publisher) => publisher?.publisher?.publisher_id === id
      );
      if (singlePublisher?.length > 0) {
        return singlePublisher[0];
      } else {
        const foundPublisherData = await Publisher.findByPk(id, {
          include: [{ model: Book, attributes: { exclude: ["publisher_id"] } }],
        });

        if (foundPublisherData) {
          const dataToReturn = {
            publisher: (({ Book, ...o }) => o)(foundPublisherData.toJSON()),
            books: foundPublisherData.toJSON()["Book" as keyof IPublisher],
          };

          publisherData.push(dataToReturn as any);
          appCache.set("PublisherByID", publisherData);

          return dataToReturn;
        }
        return { publisher: {}, books: [] as IBook[] };
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  }


async getOtherEntity(id:number): Promise<IBook[]> {
const data= await this.getEntityByID(id) as object;
return data["books" as keyof object] as IBook[];

}

}
