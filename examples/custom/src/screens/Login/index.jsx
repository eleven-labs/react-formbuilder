import React, { Component } from "react";

import LoginFormBuilder from "./formBuilder";

class LoginScreen extends Component {
  state = {
    LoginForm: null,
    payload: null
  };

  componentWillMount() {
    const LoginForm = LoginFormBuilder();
    this.setState({ LoginForm });
  }

  onSubmit = (payload, formikProps) => {
    this.setState({ payload });
  };
  render() {
    const { LoginForm, payload } = this.state;

    return (
      <div className="screen-login">
        <h1>Login Form Demo</h1>
        {LoginForm ? (
          <LoginForm.Formik
            className="screen-login__form"
            onSubmit={this.onSubmit}
          />
        ) : (
          <p>Loading ...</p>
        )}
        {payload && (
          <pre style={{ background: "#f6f8fa", padding: "1rem" }}>
            payload = {JSON.stringify(payload, null, 2)}
          </pre>
        )}
      </div>
    );
  }
}

export default LoginScreen;
