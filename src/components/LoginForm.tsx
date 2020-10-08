import React, { FC } from "react";

export type Props = {
  buttonText: string;
  onSubmit: (formData: { username: string; password: string }) => void;
};

export const LoginForm: FC<Props> = ({ onSubmit, buttonText }) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { username, password } = event.currentTarget.elements as any;

    onSubmit({
      username: username.value,
      password: password.value,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  );
};
