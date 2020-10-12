/** @jsx jsx */
import { jsx } from "@emotion/core";
import "bootstrap/dist/css/bootstrap-reboot.css";
import "@reach/dialog/styles.css";
import ReactDOM from "react-dom";
import { Button } from "./components/lib";
import { Modal, ModalContents, ModalOpenButton } from "./components/modal";
import { Logo } from "./components/Logo";
import { LoginForm, Props as LoginFormProps } from "./components/LoginForm";

function App() {
  const login: LoginFormProps["onSubmit"] = (formData) => {
    console.log("login", formData);
  };
  const register: LoginFormProps["onSubmit"] = (formData) => {
    console.log("register", formData);
  };

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gridGap: "0.75rem",
        }}
      >
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login Form" title="Login">
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
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
