import * as booksDB from "./books";
import { CustomError } from "../types";
const listItemsKey = "__bookshelf_list_items__";
type ListItems = { [key: string]: any };
let listItems: ListItems = {};
const persist = () =>
  window.localStorage.setItem(listItemsKey, JSON.stringify(listItems));
const load = () =>
  Object.assign(
    listItems,
    JSON.parse(window.localStorage.getItem(listItemsKey)!)
  );

// initialize
try {
  load();
} catch (error) {
  persist();
  // ignore json parse error
}

(window as any).__bookshelf = (window as any).__bookshelf || {};
(window as any).__bookshelf.purgeListItems = () => {
  Object.keys(listItems).forEach((key) => {
    delete listItems[key];
  });
  persist();
};

async function authorize(userId: string, listItemId: string) {
  const listItem = await read(listItemId);
  if (listItem.ownerId !== userId) {
    const error: CustomError = new Error(
      "User is not authorized to view that list"
    );
    error.status = 403;
    throw error;
  }
}

async function create({
  bookId = required("bookId"),
  ownerId = required("ownerId"),
  rating = -1,
  notes = "",
  startDate = Date.now(),
  finishDate = null,
}) {
  const id = hash(`${bookId}${ownerId}`);
  if (listItems[id]) {
    const error: CustomError = new Error(
      `This user cannot create new list item for that book`
    );
    error.status = 400;
    throw error;
  }
  const book = await booksDB.read(bookId as any);
  if (!book) {
    const error: CustomError = new Error(
      `No book found with the ID of ${bookId}`
    );
    error.status = 400;
    throw error;
  }
  listItems[id] = { id, bookId, ownerId, rating, notes, finishDate, startDate };
  persist();
  return read(id);
}

async function read(id: string) {
  validateListItem(id);
  return listItems[id];
}

async function update(id: string, updates: any) {
  validateListItem(id);
  Object.assign(listItems[id], updates);
  persist();
  return read(id);
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id: string) {
  validateListItem(id);
  delete listItems[id];
  persist();
}

async function readMany(userId: string, listItemIds: string[]) {
  return Promise.all(
    listItemIds.map((id) => {
      authorize(userId, id);
      return read(id);
    })
  );
}

async function readByOwner(userId: string) {
  return Object.values(listItems).filter((li) => li.ownerId === userId);
}

function validateListItem(id: string) {
  load();
  if (!listItems[id]) {
    const error: CustomError = new Error(`No list item with the id "${id}"`);
    error.status = 404;
    throw error;
  }
}

function hash(str: string) {
  var hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

function required(key: string) {
  const error: CustomError = new Error(`${key} is required`);
  error.status = 400;
  throw error;
}

async function reset() {
  listItems = {};
  persist();
}

export {
  authorize,
  create,
  read,
  update,
  remove,
  readMany,
  readByOwner,
  reset,
};
