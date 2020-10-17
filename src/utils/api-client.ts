async function client(
  endpoint: string,
  {
    token,
    headers: customHeaders,
    ...customConfig
  }: RequestInit & {token?: string} = {token: undefined},
) {
  const response = await window.fetch(
    `${process.env.REACT_APP_API_URL}/${endpoint}`,
    {
      method: 'GET',
      headers: {
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...customHeaders,
      },
      ...customConfig,
    },
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}

export {client};
