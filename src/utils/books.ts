import {useCallback, useContext} from 'react';
import {useQuery, queryCache} from 'react-query';
import {User} from 'auth-provider';
import {AuthContext} from 'context/auth-context';
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
  config: {
    onSuccess(books: Book[]) {
      books.forEach(book => setQueryDataForBook(book.id, book));
    },
  },
});

export function useBookSearch(query: string) {
  const {user} = useContext(AuthContext);
  const result = useQuery<Book[], Error>(getBookSearchConfig(query, user!));

  return {...result, books: result.data ?? loadingBooks};
}

export function useBook(bookId: string) {
  const {user} = useContext(AuthContext);
  const {data} = useQuery<Book, Error>({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user?.token}).then(data => data.book),
  });

  return data ?? loadingBook;
}

function refetchBookSearchQuery(user: User) {
  // queryCache.removeQueries('bookSearch');
  queryCache.prefetchQuery(getBookSearchConfig('', user));
}

export function useRefetchBookSearchQuery() {
  const {user} = useContext(AuthContext);
  return useCallback(() => refetchBookSearchQuery(user!), [user]);
}

const bookQueryConfig = {
  // The time in milliseconds after data is considered stale.
  staleTime: 1000 * 60 * 60,
  // The time in milliseconds that unused/inactive cache data remains in memory.
  cacheTime: 1000 * 60 * 60,
};

export function setQueryDataForBook(bookId: string, book: Book) {
  queryCache.setQueryData(['book', {bookId}], book, bookQueryConfig);
}
