/** @jsx jsx */
import {jsx} from '@emotion/core';

import {FC} from 'react';
import {keyframes} from '@emotion/core';
import styled, {CSSObject} from '@emotion/styled/macro';
import {Dialog as ReachDialog} from '@reach/dialog';
import {FaSpinner} from 'react-icons/fa';
import * as colors from 'styles/colors';
import * as mq from 'styles/media-queries';

type ButtonProps = {
  variant: 'primary' | 'secondary';
};

const buttonVariants: {[key in ButtonProps['variant']]: CSSObject} = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  },
};

export const Button = styled.button<ButtonProps>(
  {
    padding: '10px 15px',
    border: '0',
    lineHeight: '1',
    borderRadius: '3px',
  },
  ({variant}) => buttonVariants[variant],
);

export const Input = styled.input({
  borderRadius: '3px',
  border: `1px solid ${colors.gray10}`,
  background: colors.gray,
  padding: '8px 12px',
});

export const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

// 💰 I'm giving a few of these to you:
export const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.base,
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: 'pointer',
});

export const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  },
});

const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
});

export const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
  marginLeft: '5px',
});
Spinner.defaultProps = {
  'aria-label': 'loading',
};

export const BookListUL = styled.ul({
  listStyle: 'none',
  padding: '0',
  display: 'grid',
  gridTemplateRows: 'repeat(auto-fill, minmax(100px, 1fr))',
  gridGap: '1em',
});

type ErrorMessageProps = {
  error: Error;
  variant?: 'stacked' | 'inline';
};

const errorMessageVariants = {
  stacked: {display: 'block'},
  inline: {display: 'inline-block'},
};

export const ErrorMessage: FC<ErrorMessageProps> = ({
  error,
  variant = 'stacked',
  ...props
}) => {
  return (
    <div
      role="alert"
      css={[{color: colors.danger}, errorMessageVariants[variant]]}
      {...props}
    >
      <span>There was an error: </span>
      <pre
        css={[
          {whiteSpace: 'break-spaces', margin: '0', marginBottom: -5},
          errorMessageVariants[variant],
        ]}
      >
        {error.message}
      </pre>
    </div>
  );
};
