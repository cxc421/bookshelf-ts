import * as auth from 'auth-provider';
async function client(
  endpoint: string,
  {
    token,
    data,
    headers: customHeaders,
    ...customConfig
  }: RequestInit & {token?: string; data?: object} = {},
) {
  const response = await window.fetch(
    `${process.env.REACT_APP_API_URL}/${endpoint}`,
    {
      method: data ? 'POST' : 'GET',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        ...(data ? {'Content-type': 'application/json'} : {}),
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...customHeaders,
      },
      ...customConfig,
    },
  );

  // atuo logout if
  if (response.status === 401) {
    await auth.logout();
    window.location.assign(window.location.toString());
    return Promise.reject({message: `Please re-authenticate`});
  }

  const body = await response.json();
  if (response.ok) {
    return body;
  } else {
    return Promise.reject(body);
  }
}

export {client};
