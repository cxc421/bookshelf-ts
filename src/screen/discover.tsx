/** @jsx jsx */
import {jsx} from '@emotion/core';

import React, {useState, FC} from 'react';
import Tooltip from '@reach/tooltip';
import {FaSearch, FaTimes} from 'react-icons/fa';
import {Input, BookListUL, Spinner} from 'components/lib';
import {BookRow} from 'components/BookRow';
import * as colors from 'styles/colors';
import {User} from 'auth-provider';
import {useBookSearch} from 'utils/books';

type DiscoverBooksScreenProps = {
  user: User;
};

const DiscoverBooksScreen: FC<DiscoverBooksScreenProps> = ({user}) => {
  // query: Search input text
  const [query, setQuery] = useState('');
  // queried: Determine user sumbut seach at least one time or not. Show some welcome message
  const [queried, setQueried] = useState(false);
  // query cache
  const {books, error, isLoading, isError, isSuccess} = useBookSearch(
    query,
    user,
  );

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQueried(true);
    const searchInput = event.currentTarget.elements.namedItem(
      'search',
    ) as HTMLInputElement;
    setQuery(searchInput.value);
  }

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        {/* Search Input */}
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        {/* Search Input Button */}
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isError ? (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              ) : isLoading ? (
                <Spinner />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>
      {/* Error Messages Area  */}
      {isError ? (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error?.message}</pre>
        </div>
      ) : null}
      {/* Welcome Messages */}
      <div>
        {queried ? null : (
          <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
            <p>Welcome to the discover page.</p>
            <p>Here, let me load a few books for you...</p>
            {isLoading ? (
              <div css={{width: '100%', margin: 'auto'}}>
                <Spinner />
              </div>
            ) : isSuccess && books.length ? (
              <p>Here you go! Find more books with the search bar above.</p>
            ) : isSuccess && !books.length ? (
              <p>
                Hmmm... I couldn't find any books to suggest for you. Sorry.
              </p>
            ) : null}
          </div>
        )}
      </div>
      {/* Book List */}
      {isSuccess ? (
        books.length ? (
          <BookListUL css={{marginTop: 20}}>
            {books.map(book => (
              <li key={book.id}>
                <BookRow user={user} key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  );
};

export {DiscoverBooksScreen};
