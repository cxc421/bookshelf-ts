/** @jsx jsx */
import {jsx} from '@emotion/core';

import React, {FC, Dispatch, SetStateAction} from 'react';
import {DialogProps} from '@reach/dialog';

import {Dialog} from './lib';

type ModalContextType = [boolean, Dispatch<SetStateAction<boolean>>];
const ModalContext = React.createContext<ModalContextType | null>(null);

function useModalContext() {
  const context = React.useContext(ModalContext);
  if (!context)
    throw new Error(`useModalContext must need to under Modal component`);
  return context;
}

const Modal: FC = props => {
  const value = React.useState(false);
  return <ModalContext.Provider value={value} {...props} />;
};

const ModalDismissButton: FC = ({children: child}) => {
  const [, setIsOpen] = useModalContext();
  if (!React.isValidElement(child)) {
    return null;
  }
  return React.cloneElement(child, {onClick: () => setIsOpen(false)});
};

const ModalOpenButton: FC = ({children: child}) => {
  const [, setIsOpen] = useModalContext();
  if (!React.isValidElement(child)) {
    return null;
  }
  return React.cloneElement(child, {onClick: () => setIsOpen(true)});
};

const ModalContents: FC<Omit<DialogProps, 'isOpen' | 'setIsOpen'>> = props => {
  const [isOpen, setIsOpen] = useModalContext();

  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  );
};

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents};
