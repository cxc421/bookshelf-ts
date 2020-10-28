import {Book} from 'types/bookTypes';

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
