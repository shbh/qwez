import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  passwordChange(ev) {
    ev.preventDefault();
    const value = ev.target.value;
    this.setState({
      password: value
    });
  }

  emailChange(ev) {
    ev.preventDefault();
    const value = ev.target.value;
    this.setState({
      email: value
    });
  }

  login(ev) {

    ev.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) {
      return;
    }
    axios.post('/api/login', { username: email, password })
      .then(res => {
        window.location.reload();
        // this.props.history.push('/dashboard');
      })
      .catch(err => {
        console.log(err);
      })
  }

  renderNavLinks() {
    if (this.props.user) {
      return (
        <p key="3" className="control">
          <a className="button is-light" href="/api/logout">
            <span className="icon">
              <i className="fas fa-sign-out-alt" />
            </span>
            <span>Logout</span>
          </a>
        </p>
      )
    }

    if (this.props.user === false) {
      return;
      return (
        <span className="navbar-item">
          <a className="button is-white is-outlined" href="/auth/google">
            <span className="icon">
              <i className="fab fa-google" />
            </span>
            <span>Sign In With Google</span>
          </a>
        </span>
      );
    }
  }

  renderButton() {
    switch (this.props.user) {
      case null:
        return;
      case false:
        return (
          <a className="button is-white is-outlined" href="/auth/google">
            <span className="icon">
              <i className="fab fa-google" />
            </span>
            <span>Get Started</span>
          </a>
        );

      default:
        return (
          <a className="button is-white is-outlined" href="/dashboard">
            <span>Go to Dashboard</span>
            <span className="icon">
              <i className="fas fa-arrow-right" />
            </span>
          </a>
        );
    }
  }

  renderForm() {
    switch (this.props.user) {
      case null:
        return;
      case false:
        return (
          <div className="card form-container login-form">

            <form>
              <h2> Please Login </h2>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input className="input" value={this.state.email} onChange={this.emailChange.bind(this)} type="email" placeholder="Username"></input>
                </div>

              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">

                  <input className="input" value={this.state.password} onChange={this.passwordChange.bind(this)} type="password" placeholder="Password"></input>
                </div>

              </div>
              <button onClick={this.login.bind(this)} className="button is-fullwidth is-primary">
                <span>
                  Sign In
                </span>
                <span className="icon ">
                  <i className="fas fa-arrow-right " />
                </span>
              </button>

            </form>
          </div>
        );
      default:
        return (
          <div className="has-text-centered">
            <a className="button is-white is-outlined" href="/dashboard">
              <span>Go to Dashboard</span>
              <span className="icon">
                <i className="fas fa-arrow-right" />
              </span>
            </a>

          </div>
        );
    }
  }

  render() {
    return (
      <section className="hero is-info is-fullheight">
        <div className="hero-head">
          <nav className="navbar">
            <div className="container">
              <div className="navbar-brand">
                <a className="navbar-item" href="../">
                  <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    QWEZ
                  </span>
                </a>
                <span className="navbar-burger burger" data-target="navbarMenu">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
              <div id="navbarMenu" className="navbar-menu">
                <div className="navbar-end">{this.renderNavLinks()}</div>
              </div>
            </div>
          </nav>
        </div>
        <div className="hero-body">
          <div className="container ">
            <div className="column is-6 is-offset-3">
              <h1 className="title has-text-centered">Welcome to Qwez!!</h1>
              <h2 className="subtitle has-text-centered">
                This is a platform where we will learn and share knowledge
                together. Let's make studying fun again!
              </h2>
              {/* {this.renderButton()} */}
              {this.renderForm()}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth
});

export default connect(mapStateToProps)(Landing);
