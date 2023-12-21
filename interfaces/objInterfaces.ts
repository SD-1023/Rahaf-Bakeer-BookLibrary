


export interface IBook{
    book_id?:number;
    title:string;
    isbn:number;
    publisher_id:number;
    year?:number;
    author?:string;
    pages?:number;
}



export interface IPublisher{
    publisher_id?:number;
    name:string;
    counters?:string;
}


export interface IComment{
    comment_id?:number;
    book_id:number;
    name:string;
    comment:string;
    stars?:number;
}


export default{
 
}