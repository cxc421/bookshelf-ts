/** @jsx jsx */
import {jsx} from '@emotion/core';

import React, {FC} from 'react';
import Tooltip from '@reach/tooltip';
import {FaRegCalendarAlt} from 'react-icons/fa';
import debounceFn from 'debounce-fn';
import {useParams} from 'react-router-dom';
import {User} from 'auth-provider';
import {useQuery, useMutation, queryCache} from 'react-query';
import * as mq from 'styles/media-queries';
import * as colors from 'styles/colors';
import {Book} from 'components/BookRow';
import {StatusButtons} from 'components/StatusButtons';
import {Rating} from 'components/Rating';
import {Textarea} from 'components/lib';
import {client} from 'utils/api-client';
import {formatDate} from 'utils/misc';
import bookPlaceholderSvg from 'assets/book-placeholder.svg';
import {ListItem} from 'test/types';

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
};

type BookScreenParams = {bookId: string};
type BookScreenProps = {user: User};

const BookScreen: FC<BookScreenProps> = ({user}) => {
  const {bookId} = useParams<BookScreenParams>();
  const {data: book} = useQuery<Book, Error>({
    queryKey: ['book', {bookId}],
    queryFn: (key: string, {bookId}: BookScreenParams) =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  });
  const bookIsLoading = typeof book === 'undefined';
  const {title, author, coverImageUrl, publisher, synopsis} =
    book ?? loadingBook;

  const {data: listItems} = useQuery<ListItem[], Error>({
    queryKey: 'list-items',
    queryFn: (key: string) =>
      client(key, {token: user.token}).then(data => data.listItems),
  });
  const listItem = listItems?.find(item => item.bookId === bookId);

  return (
    <div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gridGap: '2em',
          marginBottom: '1em',
          [mq.small]: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <img
          src={coverImageUrl}
          alt={`${title} book cover`}
          css={{width: '100%', maxWidth: '14rem'}}
        />
        <div>
          <div css={{display: 'flex', position: 'relative'}}>
            <div css={{flex: 1, justifyContent: 'space-between'}}>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span css={{marginRight: 6, marginLeft: 6}}>|</span>
                <i>{publisher}</i>
              </div>
            </div>
            <div
              css={{
                right: 0,
                color: colors.gray80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minHeight: 100,
              }}
            >
              {bookIsLoading ? null : (
                <StatusButtons user={user} book={book!} />
              )}
            </div>
          </div>
          <div css={{marginTop: 10, height: 46}}>
            {listItem?.finishDate ? (
              <Rating user={user} listItem={listItem} />
            ) : null}
            {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {!bookIsLoading && listItem ? (
        <NotesTextarea user={user} listItem={listItem} />
      ) : null}
    </div>
  );
};

type ListItemTimeframeProps = {listItem: ListItem};
function ListItemTimeframe({listItem}: ListItemTimeframeProps) {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date';

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{marginTop: 6}}>
        <FaRegCalendarAlt css={{marginTop: -2, marginRight: 5}} />
        <span>
          {formatDate(listItem.startDate)}{' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  );
}

type NotesTextareaProps = {listItem: ListItem; user: User};
function NotesTextarea({listItem, user}: NotesTextareaProps) {
  const [mutate] = useMutation<unknown, Error, Partial<ListItem>>(
    (data: Partial<ListItem>) =>
      client(`list-items/${listItem.id}`, {
        token: user.token,
        method: 'PUT',
        data,
      }),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  );

  const debouncedMutate = React.useMemo(() => debounceFn(mutate, {wait: 300}), [
    mutate,
  ]);

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    debouncedMutate({id: listItem.id, notes: e.target.value});
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  );
}

export {BookScreen};
