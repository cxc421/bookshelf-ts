import "@reach/dialog/styles.css";
import React from "react";
import ReactDOM from "react-dom";
import { Dialog } from "@reach/dialog";
import { Logo } from "./components/Logo";
import { LoginForm, Props as LoginFormProps } from "./components/LoginForm";

type OpenModalState = "none" | "login" | "register";

function App() {
  const [openModal, setOpenModal] = React.useState<OpenModalState>("none");

  const login: LoginFormProps["onSubmit"] = (formData) => {
    console.log("login", formData);
  };
  const register: LoginFormProps["onSubmit"] = (formData) => {
    console.log("register", formData);
  };

  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setOpenModal("login")}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenModal("register")}>Register</button>
      </div>
      <Dialog aria-label="Login form" isOpen={openModal === "login"}>
        <div>
          <button onClick={() => setOpenModal("none")}>Close</button>
        </div>
        <h3>Login</h3>
        <LoginForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog aria-label="Registration form" isOpen={openModal === "register"}>
        <div>
          <button onClick={() => setOpenModal("none")}>Close</button>
        </div>
        <h3>Register</h3>
        <LoginForm onSubmit={register} buttonText="Register" />
      </Dialog>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
