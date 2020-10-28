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
import {useAsync} from 'utils/hooks';
import * as colors from 'styles/colors';
import {CircleButton, Spinner} from './lib';
import {User} from '../auth-provider';
import {Book} from 'types/bookTypes';
import {
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
} from 'utils/list-items';

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
  const {isLoading, isError, error, run, reset} = useAsync();

  function handleClick() {
    if (isError) {
      reset();
    } else {
      run(onClick());
    }
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
  const listItem = useListItem(user, book.id);
  const [updateListItem] = useUpdateListItem(user, {throwOnError: true});
  const [removeListItem] = useRemoveListItem(user, {throwOnError: true});
  const [createListItem] = useCreateListItem(user, {throwOnError: true});

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
