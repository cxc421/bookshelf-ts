/** @jsx jsx */
import {jsx} from '@emotion/core';

import {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {keyframes} from '@emotion/core';
import styled, {CSSObject} from '@emotion/styled/macro';
import {Dialog as ReachDialog} from '@reach/dialog';
import {FaSpinner} from 'react-icons/fa';
import * as colors from 'styles/colors';
import * as mq from 'styles/media-queries';
import {FallbackProps} from 'react-error-boundary';

/**
 * Button
 */
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

/**
 * CircleButton
 */
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

/**
 * FormGroup
 */
export const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

/**
 * Dialog
 */
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

/**
 * Spinner
 */
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

/**
 * FullPageSpinner
 */
export function FullPageSpinner() {
  return (
    <div
      css={{
        fontSize: '4em',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner />
    </div>
  );
}

/**
 * BookListUL
 */
export const BookListUL = styled.ul({
  listStyle: 'none',
  padding: '0',
  display: 'grid',
  gridTemplateRows: 'repeat(auto-fill, minmax(100px, 1fr))',
  gridGap: '1em',
});

/**
 * ErroMessage
 */
type ErrorMessageProps = {
  error?: Error;
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
        {error?.message}
      </pre>
    </div>
  );
};

export function FullPageErrorFallback({error}: FallbackProps) {
  return (
    <div
      role="alert"
      css={{
        color: colors.danger,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error?.message}</pre>
    </div>
  );
}

/**
 * Link
 */
export const Link = styled(RouterLink)({
  color: colors.indigo,
  ':hover': {
    color: colors.indigoDarken10,
    textDecoration: 'underline',
  },
});

/**
 * Input and TextArea
 */
const inputStyles = {
  border: `1px solid ${colors.gray10}`,
  background: colors.gray,
  padding: '8px 12px',
};
export const Input = styled.input({borderRadius: '3px'}, inputStyles);
export const Textarea = styled.textarea(inputStyles);
