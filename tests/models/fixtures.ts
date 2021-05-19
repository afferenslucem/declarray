import { ICat } from './i-cat';
import { IPerson } from './i-person';
import { IBook } from './i-book';

export const cats: ICat[] = [
    {
        name: 'Bella',
        breed: 'Abyssinian Cat',
        age: 2,
        favoriteToys: ['mouse', 'track ball'],
    },
    {
        name: 'Kitty',
        breed: 'American Bobtail Cat Breed',
        age: 5,
        favoriteToys: [],
    },
    {
        name: 'Lilly',
        breed: 'American Curl Cat Breed',
        age: 11,
    },
    {
        name: 'Charlie',
        breed: 'American Curl Cat Breed',
        age: 10,
    },
    {
        name: 'Lucy',
        breed: 'American Shorthair Cat',
        age: 4,
    },
    {
        name: 'Leo',
        breed: 'American Wirehair Cat Breed',
        age: 6,
    },
    {
        name: 'Milo',
        breed: 'Balinese-Javanese Cat Breed',
        age: 8,
        favoriteToys: ['laser'],
    },
    {
        name: 'Jack',
        breed: 'Balinese-Javanese Cat Breed',
        age: 5,
    },
    {
        name: 'Lilly',
        breed: 'Balinese-Javanese Cat Breed',
        age: 2,
    },
    {
        name: 'Kitty',
        breed: 'Balinese-Javanese Cat Breed',
        age: 7,
    },
    {
        name: 'Kitty',
        breed: 'American Curl Cat Breed',
        age: 11,
    },
    {
        name: 'Milo',
        breed: 'American Wirehair Cat Breed',
        age: 2,
    },
    {
        name: 'Charlie',
        breed: 'Balinese-Javanese Cat Breed',
        age: 5,
    },
];

export const persons: IPerson[] = [
    {
        name: 'Jack',
        age: 12,
    },
    {
        name: 'Simon',
        age: 23,
    },
    {
        name: 'Lola',
        age: 32,
    },
    {
        name: 'Emy',
        age: 19,
    },
    {
        name: 'Harry',
        age: 35,
    },
];

export const books: IBook[] = [
    {
        guid: '0177cabd-a838-4e70-cf75-3442496b96dd',
        name: 'Мастер и Маргарита',
        authors: ['Михаил Булгаков'],
        status: 2,
        genre: 'Классика',
        year: 2020,
        type: 0,
    },
    {
        guid: '01781710-b5be-4552-8fb7-3442496b96dd',
        name: 'Преступление и наказание',
        authors: ['Федор Достоевский'],
        status: 0,
        genre: 'Классика',
        year: null,
        type: 0,
    },
    {
        guid: '017859c9-1f79-423d-b7e2-3442496b96dd',
        name: 'Метро 2034',
        authors: ['Дмитрий Глуховский'],
        status: 2,
        genre: 'Фантастика',
        year: null,
        type: 2,
    },
    {
        guid: '017859cb-bacd-4b27-a032-3442496b96dd',
        name: 'Метро 2033',
        authors: ['Дмитрий Глуховский'],
        status: 2,
        genre: 'Фантастика',
        year: null,
        type: 1,
    },
];
