/** @jsx jsx */
import { jsx } from "@emotion/core";

import React, { FC } from "react";
import { Route, Link, LinkProps, Switch } from "react-router-dom";
import { Button } from "components/lib";
import * as mq from "styles/media-queries";
import { User } from "auth-provider";
import { DiscoverBooksScreen } from "screen/discover";
import { BookScreen } from "screen/book";
import { NotFoundScreen } from "screen/not-found";
import * as colors from "styles/colors";

type AuthenticatedAppProps = {
  user: User;
  logout: () => Promise<void>;
};

const AuthenticatedApp: FC<AuthenticatedAppProps> = ({ user, logout }) => {
  return (
    <React.Fragment>
      <div
        css={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        {user.username}
        <Button
          variant="secondary"
          css={{ marginLeft: "10px" }}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
      <div
        css={{
          margin: "0 auto",
          padding: "4em 2em",
          maxWidth: "840px",
          width: "100%",
          display: "grid",
          gridGap: "1em",
          gridTemplateColumns: "1fr 3fr",
          [mq.small]: {
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto",
            width: "100%",
          },
        }}
      >
        <div css={{ position: "relative" }}>
          <Nav />
        </div>
        <main css={{ width: "100%" }}>
          <AppRoutes user={user} />
        </main>
      </div>
    </React.Fragment>
  );
};

function NavLink(props: LinkProps) {
  return (
    <Link
      css={{
        display: "block",
        padding: "8px 15px 8px 10px",
        margin: "5px 0",
        width: "100%",
        height: "100%",
        color: colors.text,
        borderRadius: "2px",
        borderLeft: "5px solid transparent",
        ":hover": {
          color: colors.indigo,
          textDecoration: "none",
          background: colors.gray10,
        },
      }}
      {...props}
    />
  );
}

function Nav() {
  return (
    <nav
      css={{
        position: "sticky",
        top: "4px",
        padding: "1em 1.5em",
        border: `1px solid ${colors.gray10}`,
        borderRadius: "3px",
        [mq.small]: {
          position: "static",
          top: "auto",
        },
      }}
    >
      <ul
        css={{
          listStyle: "none",
          padding: "0",
        }}
      >
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  );
}

type AppRoutesProps = { user: User };

function AppRoutes({ user }: AppRoutesProps) {
  return (
    <Switch>
      <Route path="/discover">
        <DiscoverBooksScreen user={user} />
      </Route>
      <Route path="/book/:bookId">
        <BookScreen user={user} />
      </Route>
      <Route>
        <NotFoundScreen />
      </Route>
    </Switch>
  );
}

export { AuthenticatedApp };
