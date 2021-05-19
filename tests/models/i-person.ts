import { ICat } from './i-cat';

export interface IPerson {
    name: string;
    age: number;
    cats?: ICat[];
}
