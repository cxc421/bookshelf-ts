/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { FC, ReactElement } from "react";
import { FormGroup, Input, Spinner } from "./lib";

export type Props = {
  onSubmit: (formData: { username: string; password: string }) => void;
  submitButton: ReactElement;
};

export const LoginForm: FC<Props> = ({ onSubmit, submitButton }) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { username, password } = event.currentTarget.elements as any;

    onSubmit({
      username: username.value,
      password: password.value,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        "> div": {
          margin: "10px auto",
          width: "100%",
          maxWidth: "300px",
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
          {React.cloneElement(submitButton, { type: "submit" })}
          <Spinner />
        </div>
      </div>
    </form>
  );
};
