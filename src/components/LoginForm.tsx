/** @jsx jsx */
import {jsx} from '@emotion/core';
import React, {FC, ReactElement} from 'react';
import {ErrorMessage, FormGroup, Input, Spinner} from './lib';
import {useAsync} from '../utils/hooks';

export type Props = {
  onSubmit: (formData: {username: string; password: string}) => Promise<void>;
  submitButton: ReactElement;
};

export const LoginForm: FC<Props> = ({onSubmit, submitButton}) => {
  const {isLoading, isError, error, run} = useAsync();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const {username, password} = event.currentTarget.elements as any;

    run(
      onSubmit({
        username: username.value,
        password: password.value,
      }),
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '> div': {
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px',
        },
      }}
    >
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>
        <div>
          {React.cloneElement(
            submitButton,
            {type: 'submit'},
            ...(Array.isArray(submitButton.props.children)
              ? submitButton.props.children
              : [submitButton.props.children]),
            isLoading ? <Spinner css={{marginLeft: 5}} /> : null,
          )}
        </div>
      </div>
      {isError ? <ErrorMessage error={error!} /> : null}
    </form>
  );
};
