
import { IBook,IPublisher,IComment } from "./objInterfaces";
export default interface DBAction<T>{
    addEntities(data:T):Promise<T>;
    updateEntities(updateValue:Object,conditionKey:string,conditionValue:string|number):Promise<T|T[]|void|number> ;
    getEntities(data?:string|number|Object,updated?:boolean):Promise<T | T[]>;
    deleteEntities(conditionKey:string,conditionValue:string|number):Promise<void|boolean>;
    getEntityByID(id:number):Promise<IBook|IPublisher|IComment|object>;

}