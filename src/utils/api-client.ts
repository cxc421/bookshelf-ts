async function client(endpoint: string, customConfig = {}) {
  const response = await window.fetch(
    `${process.env.REACT_APP_API_URL}/${endpoint}`,
    {
      method: "GET",
      ...customConfig,
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}

export { client };
