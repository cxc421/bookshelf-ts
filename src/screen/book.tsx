/** @jsx jsx */
import {jsx} from '@emotion/core';

import React, {FC} from 'react';
import Tooltip from '@reach/tooltip';
import {FaRegCalendarAlt} from 'react-icons/fa';
import debounceFn from 'debounce-fn';
import {useParams} from 'react-router-dom';

import {ListItem} from 'types/listItemTypes';
import {User} from 'auth-provider';
import * as mq from 'styles/media-queries';
import * as colors from 'styles/colors';
import {StatusButtons} from 'components/StatusButtons';
import {Rating} from 'components/Rating';
import {Textarea, ErrorMessage} from 'components/lib';
import {formatDate} from 'utils/misc';
import {useBook} from 'utils/books';
import {useListItem, useUpdateListItem} from 'utils/list-items';

type BookScreenParams = {bookId: string};
type BookScreenProps = {user: User};

const BookScreen: FC<BookScreenProps> = ({user}) => {
  const {bookId} = useParams<BookScreenParams>();
  const book = useBook(bookId, user);
  const listItem = useListItem(user, bookId);
  const {title, author, coverImageUrl, publisher, synopsis} = book;

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
              {book.loadingBook ? null : (
                <StatusButtons user={user} book={book} />
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
      {!book.loadingBook && listItem ? (
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
  const [mutate, {error, isError}] = useUpdateListItem(user);
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
        {isError ? (
          <ErrorMessage
            error={error!}
            variant="inline"
            css={{marginLeft: 6, fontSize: '0.7em'}}
          />
        ) : null}
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
