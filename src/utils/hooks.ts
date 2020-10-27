import React from 'react';

function useSafeDispatch(dispatch: React.Dispatch<any>) {
  const mounted = React.useRef(false);
  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return React.useCallback(
    (arg: any) => (mounted.current ? dispatch(arg) : void 0),
    [dispatch],
  );
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])
type AsyncState<T> =
  | {status: 'idle'; data: null; error: null}
  | {status: 'pending'; data: null; error: null}
  | {status: 'resolved'; data: T; error: null}
  | {status: 'rejected'; data: null; error: Error};

const defaultInitialState = {
  status: 'idle',
  data: null,
  error: null,
};
function useAsync<T = any>(
  initialState: AsyncState<T> = {status: 'idle', data: null, error: null},
) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  });
  const [{status, data, error}, setState] = React.useReducer(
    (s: AsyncState<T>, a: AsyncState<T>) => ({...s, ...a}),
    initialStateRef.current,
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback(
    data => safeSetState({data, status: 'resolved'}),
    [safeSetState],
  );
  const setError = React.useCallback(
    error => safeSetState({error, status: 'rejected'}),
    [safeSetState],
  );
  const reset = React.useCallback(() => safeSetState(initialStateRef.current), [
    safeSetState,
  ]);

  const run = React.useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        );
      }
      safeSetState({status: 'pending'});
      return promise.then(
        (data: T) => {
          setData(data);
          return data;
        },
        (error: Error) => {
          setError(error);
          return Promise.reject(error);
        },
      );
    },
    [safeSetState, setData, setError],
  );

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

export {useAsync};
