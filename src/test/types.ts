export type CustomError = {status?: number} & Error;

export type Book = {
  title: string;
  author: string;
  coverImageUrl: string;
  id: string;
  publisher: string;
  synopsis: string;
};

export type ListItem = {
  id: string;
  bookId: string;
  ownerId: string;
  rating: number;
  notes: string;
  finishDate: null | number;
  startDate: Date;
  book: Book;
};
