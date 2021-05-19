export interface IBook {
    guid: string;
    name: string;
    authors?: string[];
    favoriteToys?: string[];
    genre?: string;
    status?: number;
    type?: number;
    year?: number;
}

export interface IBookShort {
    name: string;
    authors?: string[];
}
