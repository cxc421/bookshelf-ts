/** @jsx jsx */
import {jsx} from '@emotion/core';

import {BookListUL} from './lib';
import {BookRow} from './BookRow';
import {ListItem} from 'types/listItemTypes';
import {ReactElement, FC} from 'react';
import {useListItems} from 'utils/list-items';

type ListItemListProps = {
  filterListItems: (listTem: ListItem) => boolean;
  noListItems: ReactElement;
  noFilteredListItems: ReactElement;
};

const ListItemList: FC<ListItemListProps> = ({
  filterListItems,
  noListItems,
  noFilteredListItems,
}) => {
  const listItems = useListItems();

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
          <BookRow book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  );
};

export {ListItemList};
