/** @jsx jsx */
import {jsx} from '@emotion/core';

import React, {FC, ReactElement} from 'react';
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaTimesCircle,
  FaBook,
} from 'react-icons/fa';
import Tooltip from '@reach/tooltip';
import {useQuery, useMutation, queryCache} from 'react-query';
import {client} from 'utils/api-client';
import {useAsync} from 'utils/hooks';
import * as colors from 'styles/colors';
import {CircleButton, Spinner} from './lib';
import {User} from '../auth-provider';
import {Book} from 'types/bookTypes';
import {ListItem} from 'types/listItemTypes';

type TooltipButtonProps = {
  label: string;
  highlight: string;
  onClick: () => Promise<any>;
  icon: ReactElement;
};

const TooltipButton: FC<TooltipButtonProps> = ({
  label,
  highlight,
  onClick,
  icon,
  ...rest
}) => {
  const {isLoading, isError, error, run} = useAsync();

  function handleClick() {
    run(onClick());
  }

  return (
    <Tooltip label={isError ? error?.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error?.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  );
};

type StatusButtonsProps = {
  user: User;
  book: Book;
};

const StatusButtons: FC<StatusButtonsProps> = ({user, book}) => {
  // Get List Item
  const {data: listItems} = useQuery<ListItem[], Error>({
    queryKey: 'list-items',
    queryFn: (key: string) =>
      client(key, {
        token: user.token,
      }).then(data => data.listItems),
  });
  const listItem = listItems?.find(item => item.bookId === book.id) ?? null;

  // Update List Item
  type UpdateArgs = Partial<ListItem> & Pick<ListItem, 'id'>;
  const [updateListItem] = useMutation(
    (data: UpdateArgs) =>
      client(`list-items/${data.id}`, {method: 'PUT', token: user.token, data}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  );

  // Remove List Item
  const [removeListItem] = useMutation(
    ({id}: Pick<ListItem, 'id'>) =>
      client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  );

  // Create new list item
  const [createListItem] = useMutation(
    ({bookId}: Pick<ListItem, 'bookId'>) =>
      client(`list-items`, {method: 'POST', token: user.token, data: {bookId}}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  );

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            onClick={() => updateListItem({id: listItem.id, finishDate: null})}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() =>
              updateListItem({id: listItem.id, finishDate: Date.now()})
            }
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => removeListItem({id: listItem.id})}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => createListItem({bookId: book.id})}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  );
};

export {StatusButtons};
