import {useCallback} from 'react';
import {useQuery, queryCache} from 'react-query';
import {useAuthClient} from 'context/auth-context';
import {Book} from 'types/bookTypes';
import {ClientType} from 'utils/api-client';
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

const getBookSearchConfig = (query: string, client: ClientType) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: (_key: string, {query}: {query: string}) =>
    client(`books?query=${encodeURIComponent(query)}`).then(
      (data: BooksQueryData) => data.books,
    ),
  config: {
    onSuccess(books: Book[]) {
      books.forEach(book => setQueryDataForBook(book.id, book));
    },
  },
});

export function useBookSearch(query: string) {
  const authClient = useAuthClient();
  const result = useQuery<Book[], Error>(
    getBookSearchConfig(query, authClient),
  );

  return {...result, books: result.data ?? loadingBooks};
}

export function useBook(bookId: string) {
  const authClient = useAuthClient();
  const {data} = useQuery<Book, Error>({
    queryKey: ['book', {bookId}],
    queryFn: () => authClient(`books/${bookId}`).then(data => data.book),
  });

  return data ?? loadingBook;
}

export function useRefetchBookSearchQuery() {
  const authClient = useAuthClient();
  return useCallback(() => {
    // queryCache.removeQueries('bookSearch');
    queryCache.prefetchQuery(getBookSearchConfig('', authClient));
  }, [authClient]);
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
