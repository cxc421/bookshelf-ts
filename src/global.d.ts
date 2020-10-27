import * as reactQuery from 'react-query';

declare global {
  interface Window {
    reactQuery?: reactQuery;
    Cypress?: any;
    __bookshelf?: {
      purgeListItems?: () => void;
      purgeUsers?: () => void;
    };
  }
}
