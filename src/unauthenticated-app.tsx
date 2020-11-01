/** @jsx jsx */
import {jsx} from '@emotion/core';

import 'bootstrap/dist/css/bootstrap-reboot.css';
import React, {FC, ReactElement} from 'react';
import VisuallyHidden from '@reach/visually-hidden';
import '@reach/dialog/styles.css';
import {Button, Dialog, CircleButton} from './components/lib';
// import {Modal, ModalContents, ModalOpenButton} from './components/modal';
import {Logo} from './components/Logo';
import {LoginForm} from './components/LoginForm';
import {useAuth} from 'context/auth-context';

// 💣 when you're all done, you'll be able to completely delete this
type LoginFormModalProps = {
  onSubmit: (formData: {username: string; password: string}) => Promise<void>;
  modalTitleText: string;
  modalLabelText: string;
  submitButton: ReactElement;
  openButton: ReactElement;
};

const LoginFormModal: FC<LoginFormModalProps> = ({
  onSubmit,
  modalTitleText,
  modalLabelText,
  submitButton,
  openButton,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <React.Fragment>
      {React.cloneElement(openButton, {onClick: () => setIsOpen(true)})}
      <Dialog
        aria-label={modalLabelText}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      >
        <div css={{display: 'flex', justifyContent: 'flex-end'}}>
          {/* 💰 here's what you should put in your <ModalDismissButton> */}
          <CircleButton onClick={() => setIsOpen(false)}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </div>
        <h3 css={{textAlign: 'center', fontSize: '2em'}}>{modalTitleText}</h3>
        <LoginForm onSubmit={onSubmit} submitButton={submitButton} />
      </Dialog>
    </React.Fragment>
  );
};

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
        {/* 🐨 replace both of these with the Modal compound components */}
        {/*
          🦉 when you're done, it'll look a lot more complicated than
             it did when you started, but the extra credits will help clean
             things up a bit.
        */}
        <LoginFormModal
          onSubmit={login}
          modalTitleText="Login"
          modalLabelText="Login form"
          submitButton={<Button variant="primary">Login</Button>}
          openButton={<Button variant="primary">Login</Button>}
        />
        <LoginFormModal
          onSubmit={register}
          modalTitleText="Register"
          modalLabelText="Registration form"
          submitButton={<Button variant="secondary">Register</Button>}
          openButton={<Button variant="secondary">Register</Button>}
        />
      </div>
    </div>
  );
};

export {UnauthenticatedApp};
