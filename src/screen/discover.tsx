/** @jsx jsx */
import {jsx} from '@emotion/core';
import React, {useState, useEffect, FC} from 'react';

import '../bootstrap';
import Tooltip from '@reach/tooltip';
import {FaSearch, FaTimes} from 'react-icons/fa';
import {Input, BookListUL, Spinner} from 'components/lib';
import {BookRow, Book} from 'components/BookRow';
import {client} from 'utils/api-client';
import {useAsync} from 'utils/hooks';
import * as colors from 'styles/colors';
import {User} from 'auth-provider';

type Data = {books: Book[]};

type DiscoverBooksScreenProps = {
  user: User;
};

const DiscoverBooksScreen: FC<DiscoverBooksScreenProps> = ({user}) => {
  const {data, error, run, isLoading, isError, isSuccess} = useAsync<Data>();
  const [query, setQuery] = useState('');
  const [queried, setQueried] = useState(false);

  useEffect(() => {
    if (!queried) return;
    run(
      client(`books?query=${encodeURIComponent(query)}`, {token: user.token}),
    );
  }, [queried, query, run, user.token]);

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
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
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

      {isError ? (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error?.message}</pre>
        </div>
      ) : null}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id}>
                <BookRow key={book.id} book={book} />
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
