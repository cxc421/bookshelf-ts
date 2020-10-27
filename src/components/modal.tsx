/** @jsx jsx */
import {jsx} from '@emotion/core';

import React, {FC, ReactElement} from 'react';
import VisuallyHidden from '@reach/visually-hidden';
import {Dialog, CircleButton} from './lib';
import {DialogProps} from '@reach/dialog';

const callAll = (...fns: (Function | undefined)[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));

type ModalContextInterface = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
];

const ModalContext = React.createContext<ModalContextInterface | null>(null);

const Modal: FC<{}> = props => {
  const [isOpen, setIsOpen] = React.useState(false);

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />;
};

const ModalDismissButton: FC<{}> = ({children}) => {
  const child = children as any;
  const [, setIsOpen] = React.useContext(ModalContext)!;
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  });
};

const ModalOpenButton: FC<{children: ReactElement}> = ({children: child}) => {
  const [, setIsOpen] = React.useContext(ModalContext)!;
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  });
};

function ModalContentsBase(props: DialogProps) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)!;
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  );
}

type ModalContentsProps = DialogProps & {
  title: string;
};

const ModalContents: FC<ModalContentsProps> = ({title, children, ...props}) => {
  return (
    <ModalContentsBase {...props}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
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

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents};
