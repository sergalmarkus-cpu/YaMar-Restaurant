export interface Product {

    id:number;

    name:string;

    description:string;

    categoryId:number;

    category:string;

    price:number;

    image:string | null;

    available:boolean;

    featured:boolean;

    dailySpecial:boolean;

    active:boolean;

}