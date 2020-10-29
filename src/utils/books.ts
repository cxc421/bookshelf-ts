import {User} from 'auth-provider';
import {useQuery, queryCache} from 'react-query';
import {Book} from 'types/bookTypes';
import {client} from 'utils/api-client';
import bookPlaceholderSvg from 'assets/book-placeholder.svg';

const loadingBook: Book = {
  id: `loading-book`,
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
};

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  ...loadingBook,
  id: `loading-book-${index}`,
}));

type BooksQueryData = {books: Book[]};

const getBookSearchConfig = (query: string, user: User) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: (_key: string, {query}: {query: string}) =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then((data: BooksQueryData) => data.books),
});

export function useBookSearch(query: string, user: User) {
  const result = useQuery<Book[], Error>(getBookSearchConfig(query, user));

  return {...result, books: result.data ?? loadingBooks};
}

export function useBook(bookId: string, user: User) {
  const {data} = useQuery<Book, Error>({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  });

  return data ?? loadingBook;
}

export function refetchBookSearchQuery(user: User) {
  queryCache.prefetchQuery(getBookSearchConfig('', user));
}
