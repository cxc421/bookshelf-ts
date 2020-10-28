import {User} from 'auth-provider';
import {useQuery, useMutation, queryCache, MutationConfig} from 'react-query';
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

type UpdateArgs = Partial<ListItem> & Pick<ListItem, 'id'>;
export function useUpdateListItem(
  user: User,
  config?: MutationConfig<any, Error, UpdateArgs, unknown> | undefined,
) {
  return useMutation<any, Error, UpdateArgs>(
    (data: UpdateArgs) =>
      client(`list-items/${data.id}`, {method: 'PUT', token: user.token, data}),
    {...defaultMutationOptions, ...config},
  );
}

export function useRemoveListItem(
  user: User,
  config?:
    | MutationConfig<any, Error, Pick<ListItem, 'id'>, unknown>
    | undefined,
) {
  return useMutation(
    ({id}: Pick<ListItem, 'id'>) =>
      client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {...defaultMutationOptions, ...config},
  );
}

export function useCreateListItem(
  user: User,
  config?:
    | MutationConfig<any, Error, Pick<ListItem, 'bookId'>, unknown>
    | undefined,
) {
  return useMutation(
    ({bookId}: Pick<ListItem, 'bookId'>) =>
      client(`list-items`, {method: 'POST', token: user.token, data: {bookId}}),
    {...defaultMutationOptions, ...config},
  );
}
