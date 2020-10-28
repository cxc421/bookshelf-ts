import {User} from 'auth-provider';
import {useQuery, useMutation, queryCache} from 'react-query';
import {ListItem} from 'types/listItemTypes';
import {client} from 'utils/api-client';

export function useListItems(user: User) {
  const {data} = useQuery<ListItem[], Error>({
    queryKey: 'list-items',
    queryFn: (key: string) =>
      client(key, {token: user.token}).then(data => data.listItems),
  });
  return data ?? [];
}

export function useListItem(user: User, bookId: string) {
  const listItems = useListItems(user);
  return listItems.find(item => item.bookId === bookId);
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
};

export function useUpdateListItem(user: User) {
  type UpdateArgs = Partial<ListItem> & Pick<ListItem, 'id'>;

  const [updateListItem] = useMutation(
    (data: UpdateArgs) =>
      client(`list-items/${data.id}`, {method: 'PUT', token: user.token, data}),
    defaultMutationOptions,
  );

  return updateListItem;
}

export function useRemoveListItem(user: User) {
  const [removeListItem] = useMutation(
    ({id}: Pick<ListItem, 'id'>) =>
      client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    defaultMutationOptions,
  );

  return removeListItem;
}

export function useCreateListItem(user: User) {
  const [createListItem] = useMutation(
    ({bookId}: Pick<ListItem, 'bookId'>) =>
      client(`list-items`, {method: 'POST', token: user.token, data: {bookId}}),
    defaultMutationOptions,
  );

  return createListItem;
}
