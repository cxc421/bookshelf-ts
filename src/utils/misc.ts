const formatDate = (date: Date | number) =>
  new Intl.DateTimeFormat('en-US', {month: 'short', year: '2-digit'}).format(
    date,
  );

export {formatDate};
