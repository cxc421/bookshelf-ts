import {useAuthClient} from 'context/auth-context';
import {useQuery, useMutation, queryCache, MutationConfig} from 'react-query';
import {ListItem} from 'types/listItemTypes';
import {setQueryDataForBook} from './books';

export function useListItems() {
  const authClient = useAuthClient();
  const {data} = useQuery<ListItem[], Error>({
    queryKey: 'list-items',
    queryFn: (key: string) => authClient(key).then(data => data.listItems),
    config: {
      onSuccess: (listItems: ListItem[]) =>
        listItems.forEach(({book, bookId}) =>
          setQueryDataForBook(bookId, book),
        ),
    },
  });
  return data ?? [];
}

export function useListItem(bookId: string) {
  const listItems = useListItems();
  return listItems.find(item => item.bookId === bookId);
}

const defaultMutationOptions: MutationConfig<
  any,
  Error,
  any,
  Function | undefined
> = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
  onError(err, data, recover) {
    if (typeof recover === 'function') {
      recover();
    }
  },
};

type UpdateArgs = Partial<ListItem> & Pick<ListItem, 'id'>;

export function useUpdateListItem(
  config?:
    | MutationConfig<any, Error, UpdateArgs, Function | undefined>
    | undefined,
) {
  const authClient = useAuthClient();
  return useMutation<any, Error, UpdateArgs, Function | undefined>(
    (data: UpdateArgs) =>
      authClient(`list-items/${data.id}`, {
        method: 'PUT',
        data,
      }),
    {
      onMutate(data) {
        const listItems = queryCache.getQueryData<ListItem[]>('list-items');
        if (!listItems) return;

        const newListItems = listItems.map(li =>
          li.id === data.id ? {...li, ...data} : li,
        );
        queryCache.setQueryData('list-items', newListItems);

        return () => queryCache.setQueryData('list-items', listItems);
      },
      ...defaultMutationOptions,
      ...config,
    },
  );
}

export function useRemoveListItem(
  config?:
    | MutationConfig<any, Error, Pick<ListItem, 'id'>, Function | undefined>
    | undefined,
) {
  const authClient = useAuthClient();
  return useMutation<any, Error, Pick<ListItem, 'id'>, Function | undefined>(
    ({id}: Pick<ListItem, 'id'>) =>
      authClient(`list-items/${id}`, {method: 'DELETE'}),
    {
      onMutate(data) {
        const listItems = queryCache.getQueryData<ListItem[]>('list-items');
        if (!listItems) return;

        const newListItems = listItems.filter(li => li.id !== data.id);
        queryCache.setQueryData('list-items', newListItems);

        return () => queryCache.setQueryData('list-items', listItems);
      },
      ...defaultMutationOptions,
      ...config,
    },
  );
}

export function useCreateListItem(
  config?:
    | MutationConfig<any, Error, Pick<ListItem, 'bookId'>, Function | undefined>
    | undefined,
) {
  const authClient = useAuthClient();
  return useMutation<
    any,
    Error,
    Pick<ListItem, 'bookId'>,
    Function | undefined
  >(
    ({bookId}: Pick<ListItem, 'bookId'>) =>
      authClient(`list-items`, {
        method: 'POST',
        data: {bookId},
      }),
    {...defaultMutationOptions, ...config},
  );
}
