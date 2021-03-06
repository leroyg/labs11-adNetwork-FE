import React, { Component } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

import styled from "styled-components";

const MobileNav = styled.nav`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  a {
    font-weight: 500;
    letter-spacing: 2px;
    text-decoration: none;
    font-size: 18px;
    line-height: 60px;
    color: #000000;
    cursor: pointer;
    &:hover {
      color: #011a57;
      border-bottom: 1px solid #011a57;
    }
  }
`;

class NavDrawer extends Component {
  state = {
    isDashboard: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isDashboard !== this.state.isDashboard) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    const { toggleDrawer, left, login, logout } = this.props;
    return (
      <SwipeableDrawer open={left} onClose={toggleDrawer} onOpen={toggleDrawer}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
          style={{ zIndex: 999999999, width: "250px" }}
        >
          <MobileNav>
            <a href="#team">Team</a>
            <a href="#contact">Contact</a>
            <a href="#screenshots">Screenshots</a>
            <a href="#reviews">Reviews</a>
            <a
              href="#dashboard"
              onClick={() => this.setState({ isDashboard: true })}
              hidden={!localStorage.id_token}
            >
              Dashboard
            </a>

            {!localStorage.id_token ? (
              <a href="#login" onClick={() => login()}>
                Login
              </a>
            ) : (
              <a href="#logout" onClick={() => logout()}>
                logout
              </a>
            )}
          </MobileNav>
        </div>
      </SwipeableDrawer>
    );
  }
}

export default NavDrawer;
