/** @jsx jsx */
import {jsx} from '@emotion/core';

import React, {FC, Dispatch, SetStateAction} from 'react';
import {DialogProps} from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';

import {Dialog, CircleButton} from './lib';

const callAll = (...fns: (Function | undefined)[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));

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
  return React.cloneElement(child, {
    onClick: callAll(child.props.onClick, () => setIsOpen(false)),
  });
};

const ModalOpenButton: FC = ({children: child}) => {
  const [, setIsOpen] = useModalContext();
  if (!React.isValidElement(child)) {
    return null;
  }
  return React.cloneElement(child, {
    onClick: callAll(child.props.onClick, () => setIsOpen(true)),
  });
};

type ModalContentsBaseProps = Omit<DialogProps, 'isOpen' | 'setIsOpen'>;
const ModalContentsBase: FC<ModalContentsBaseProps> = props => {
  const [isOpen, setIsOpen] = useModalContext();

  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  );
};

// Default usecase to use ModalContentsBase
type ModalContentsProps = ModalContentsBaseProps & {title?: string};
const ModalContents: FC<ModalContentsProps> = ({
  children,
  title = '',
  ...otherProps
}) => {
  return (
    <ModalContentsBase {...otherProps}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton onClick={() => console.log(`close the modal`)}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  );
};

export {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContentsBase,
  ModalContents,
};
