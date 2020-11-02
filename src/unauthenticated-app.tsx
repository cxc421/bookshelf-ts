/** @jsx jsx */
import {jsx} from '@emotion/core';

import 'bootstrap/dist/css/bootstrap-reboot.css';
import VisuallyHidden from '@reach/visually-hidden';
import '@reach/dialog/styles.css';
import {Button, CircleButton} from './components/lib';
import {
  Modal,
  ModalContents,
  ModalOpenButton,
  ModalDismissButton,
} from './components/modal';
import {Logo} from './components/Logo';
import {LoginForm} from './components/LoginForm';
import {useAuth} from 'context/auth-context';

const circleDismissButton = (
  <div css={{display: 'flex', justifyContent: 'flex-end'}}>
    <ModalDismissButton>
      <CircleButton>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </CircleButton>
    </ModalDismissButton>
  </div>
);

const UnauthenticatedApp = () => {
  const {login, register} = useAuth();
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridGap: '0.75rem',
        }}
      >
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form">
            {circleDismissButton}
            <h3 css={{textAlign: 'center', fontSize: '2em'}}>Login</h3>
            <LoginForm
              onSubmit={login}
              submitButton={<Button variant="primary">Login</Button>}
            />
          </ModalContents>
        </Modal>

        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form">
            {circleDismissButton}
            <h3 css={{textAlign: 'center', fontSize: '2em'}}>Register</h3>
            <LoginForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  );
};

export {UnauthenticatedApp};
