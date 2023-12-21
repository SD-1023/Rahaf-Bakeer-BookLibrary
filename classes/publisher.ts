import DBAction from "../interfaces/classInterface";
import { IBook, IComment, IPublisher } from "../interfaces/objInterfaces";
import Book from "../models/Book";
import { appCache, getCacheValue } from "../appCache";
import { number } from "yup";
import Publisher from "../models/publisher";
import Comment from "../models/Comment";
import { Sequelize } from "sequelize-typescript";

export default class CPublisher implements DBAction<IPublisher> {
    addEntities(data: IPublisher): Promise<IPublisher> {
        throw new Error("Method not implemented.");
    }
    updateEntities(updateValue: Object, conditionKey: string, conditionValue: string | number): Promise<number | void | IPublisher | IPublisher[]> {
        throw new Error("Method not implemented.");
    }
    getEntities(data?: string | number | Object, updated?: boolean): Promise<IPublisher | IPublisher[]> {
        throw new Error("Method not implemented.");
    }
    deleteEntities(conditionKey: string, conditionValue: string | number): Promise<boolean | void> {
        throw new Error("Method not implemented.");
    }
    getEntityByID(id: number): Promise<object | IPublisher | IBook | IComment> {
        throw new Error("Method not implemented.");
    }




}