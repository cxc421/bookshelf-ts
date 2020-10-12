/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";

import "./bootstrap";
import Tooltip from "@reach/tooltip";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Input, BookListUL, Spinner } from "./components/lib";
import { BookRow, Book } from "./components/BookRow";
import { client } from "./utils/api-client";
import * as colors from "styles/colors";

type Data = { books: Book[] } | null;
type Status = "idle" | "loading" | "success";

function DiscoverBooksScreen() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<Data>(null);
  const [query, setQuery] = useState("");
  const [queried, setQueried] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!queried) return;
    setStatus("loading");
    setError(null);
    client(`books?query=${encodeURIComponent(query)}`)
      .then(({ books }) => {
        setData({ books });
        setStatus("success");
      })
      .catch((err) => setError(err));
  }, [queried, query]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = error !== null;

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQueried(true);
    const searchInput = event.currentTarget.elements.namedItem(
      "search"
    ) as HTMLInputElement;
    setQuery(searchInput.value);
  }

  return (
    <div
      css={{ maxWidth: 800, margin: "auto", width: "90vw", padding: "40px 0" }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{ width: "100%" }}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: "0",
                position: "relative",
                marginLeft: "-35px",
                background: "transparent",
              }}
            >
              {isError ? (
                <FaTimes aria-label="error" css={{ color: colors.danger }} />
              ) : isLoading ? (
                <Spinner />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>

      {isError ? (
        <div css={{ color: colors.danger }}>
          <p>There was an error:</p>
          <pre>{error?.message}</pre>
        </div>
      ) : null}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{ marginTop: 20 }}>
            {data.books.map((book) => (
              <li key={book.id}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  );
}

export { DiscoverBooksScreen };
