


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
    user_id:number;
    comment:string;
    stars?:number;
}




export interface IUser{

    user_id?:number;
    first_name:string;
    last_name:string;
    age?:number;
    DOB?:Date|string;
    email:string;
    password?:string;
    optCode?:number;

}

export default{
 
}