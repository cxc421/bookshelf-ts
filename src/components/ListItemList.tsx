/** @jsx jsx */
import {jsx} from '@emotion/core';

import {BookListUL} from './lib';
import {BookRow} from './BookRow';
import {User} from 'auth-provider';
import {ListItem} from 'types/listItemTypes';
import {ReactElement, FC} from 'react';
import {useListItems} from 'utils/list-items';

type ListItemListProps = {
  user: User;
  filterListItems: (listTem: ListItem) => boolean;
  noListItems: ReactElement;
  noFilteredListItems: ReactElement;
};

const ListItemList: FC<ListItemListProps> = ({
  user,
  filterListItems,
  noListItems,
  noFilteredListItems,
}) => {
  const listItems = useListItems(user);

  const filteredListItems = listItems?.filter(filterListItems);

  if (!listItems?.length) {
    return <div css={{marginTop: '1em', fontSize: '1.2em'}}>{noListItems}</div>;
  }
  if (!filteredListItems?.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        {noFilteredListItems}
      </div>
    );
  }

  return (
    <BookListUL>
      {filteredListItems.map(listItem => (
        <li key={listItem.id}>
          <BookRow user={user} book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  );
};

export {ListItemList};
