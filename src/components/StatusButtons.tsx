/** @jsx jsx */
import { jsx } from "@emotion/core";

import React, { FC } from "react";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaTimesCircle,
  FaBook,
} from "react-icons/fa";
import Tooltip from "@reach/tooltip";
import { useQuery, useMutation, queryCache } from "react-query";
import { client } from "utils/api-client";
import { useAsync } from "utils/hooks";
import * as colors from "styles/colors";
import { CircleButton, Spinner } from "./lib";
import { User } from "../auth-provider";
import { Book } from "./BookRow";
import { ListItem } from "test/types";

type TooltipButtonProps = {
  label: string;
  highlight: string;
  onClick: () => Promise<any>;
  icon: any;
};

const TooltipButton: FC<TooltipButtonProps> = ({
  label,
  highlight,
  onClick,
  icon,
  ...rest
}) => {
  const { isLoading, isError, error, run } = useAsync();

  function handleClick() {
    run(onClick());
  }

  return (
    <Tooltip label={isError ? error?.message : label}>
      <CircleButton
        css={{
          backgroundColor: "white",
          ":hover,:focus": {
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

const StatusButtons: FC<StatusButtonsProps> = ({ user, book }) => {
  const { data } = useQuery<{ listItems: ListItem[] }, Error>({
    queryKey: "list-items",
    queryFn: (key: string) =>
      client(key, {
        token: user.token,
      }),
  });

  // 🐨 search through the listItems you got from react-query and find the
  // one with the right bookId.
  const listItem = data?.listItems.find((item) => item.bookId === book.id);

  // 💰 for all the mutations below, if you want to get the list-items cache
  // updated after this query finishes the use the `onSettled` config option
  // to queryCache.invalidateQueries('list-items')

  // 🐨 call useMutation here and assign the mutate function to "update"
  // the mutate function should call the list-items/:listItemId endpoint with a PUT
  //   and the updates as data. The mutate function will be called with the updates
  //   you can pass as data.
  type UpdateArgs = Partial<ListItem> & Pick<ListItem, "id">;

  const update = (data: UpdateArgs) =>
    client(`list-items/${data.id}`, {
      method: "PUT",
      token: user.token,
      data,
    });

  const [updateListItem] = useMutation<any, Error, UpdateArgs>(update, {
    onSettled() {
      queryCache.invalidateQueries("list-items");
    },
  });

  // 🐨 call useMutation here and assign the mutate function to "remove"
  // the mutate function should call the list-items/:listItemId endpoint with a DELETE
  const remove = ({ id }: UpdateArgs) =>
    client(`list-items/${id}`, {
      method: "DELETE",
      token: user.token,
    });

  const [removeListItem] = useMutation<any, Error, UpdateArgs>(remove, {
    onSettled() {
      queryCache.invalidateQueries("list-items");
    },
  });

  // 🐨 call useMutation here and assign the mutate function to "create"
  // the mutate function should call the list-items/:listItemId endpoint with a POST
  // and the bookId the listItem is being created for.
  const create = ({ bookId }: Pick<ListItem, "bookId">) =>
    client(`list-items`, {
      method: "POST",
      token: user.token,
      data: {
        bookId,
      },
    });

  const [createListItem] = useMutation<any, Error, Pick<ListItem, "bookId">>(
    create,
    {
      onSettled() {
        queryCache.invalidateQueries("list-items");
      },
    }
  );

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            // 🐨 add an onClick here that calls update with the data we want to update
            // 💰 to mark a list item as unread, set the finishDate to null
            // {id: listItem.id, finishDate: null}
            onClick={() =>
              updateListItem({ id: listItem.id, finishDate: null })
            }
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            // 🐨 add an onClick here that calls update with the data we want to update
            // 💰 to mark a list item as unread, set the finishDate
            // {id: listItem.id, finishDate: Date.now()}
            onClick={() =>
              updateListItem({ id: listItem.id, finishDate: Date.now() })
            }
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          // 🐨 add an onClick here that calls remove
          onClick={() => removeListItem({ id: listItem.id })}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          // 🐨 add an onClick here that calls create
          onClick={() => createListItem({ bookId: book.id })}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  );
};

export { StatusButtons };
