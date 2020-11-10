/** @jsx jsx */
import {jsx} from '@emotion/core';

import {Route, Link, LinkProps, Switch, useRouteMatch} from 'react-router-dom';
import {Button, ErrorMessage, FullPageErrorFallback} from 'components/lib';
import * as mq from 'styles/media-queries';
import {DiscoverBooksScreen} from 'screen/discover';
import {BookScreen} from 'screen/book';
import {NotFoundScreen} from 'screen/not-found';
import * as colors from 'styles/colors';
import {ErrorBoundary, FallbackProps} from 'react-error-boundary';
import {ReadingListScreen} from 'screen/reading-list';
import {FinishedScreen} from 'screen/finished';
import {useUserExistAuth} from 'context/auth-context';

const AuthenticatedApp = () => {
  const {user, logout} = useUserExistAuth();
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      {/* Logout Button */}
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
      >
        {user.username}
        <Button variant="secondary" css={{marginLeft: '10px'}} onClick={logout}>
          Logout
        </Button>
      </div>
      {/* Main Area */}
      <div
        css={{
          margin: '0 auto',
          padding: '4em 2em',
          maxWidth: '840px',
          width: '100%',
          display: 'grid',
          gridGap: '1em',
          gridTemplateColumns: '1fr 3fr',
          [mq.small]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto',
            width: '100%',
          },
        }}
      >
        {/* Nav Buttons Area */}
        <div css={{position: 'relative'}}>
          <Nav />
        </div>
        {/* Main Area */}
        <main css={{width: '100%'}}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
};

function Nav() {
  return (
    <nav
      css={{
        position: 'sticky',
        top: '4px',
        padding: '1em 1.5em',
        border: `1px solid ${colors.gray10}`,
        borderRadius: '3px',
        [mq.small]: {
          position: 'static',
          top: 'auto',
        },
      }}
    >
      <ul
        css={{
          listStyle: 'none',
          padding: '0',
        }}
      >
        <li>
          <NavLink to="/list">Reading List</NavLink>
        </li>
        <li>
          <NavLink to="/finished">Finished Books</NavLink>
        </li>
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  );
}

function NavLink(props: LinkProps) {
  const matches = useRouteMatch(props.to.toString());
  // console.log({ matches });
  return (
    <Link
      css={[
        {
          display: 'block',
          padding: '8px 15px 8px 10px',
          margin: '5px 0',
          width: '100%',
          height: '100%',
          color: colors.text,
          borderRadius: '2px',
          borderLeft: '5px solid transparent',
          ':hover': {
            color: colors.indigo,
            textDecoration: 'none',
            background: colors.gray10,
          },
        },
        matches
          ? {
              borderLeft: `5px solid ${colors.indigo}`,
              background: colors.gray10,
              ':hover': {
                background: colors.gray20,
              },
            }
          : null,
      ]}
      {...props}
    />
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/list">
        <ReadingListScreen />
      </Route>
      <Route path="/finished">
        <FinishedScreen />
      </Route>
      <Route path="/discover">
        <DiscoverBooksScreen />
      </Route>
      <Route path="/book/:bookId">
        <BookScreen />
      </Route>
      <Route>
        <NotFoundScreen />
      </Route>
    </Switch>
  );
}

function ErrorFallback({error}: FallbackProps) {
  return (
    <ErrorMessage
      error={error}
      css={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}

export default AuthenticatedApp;
