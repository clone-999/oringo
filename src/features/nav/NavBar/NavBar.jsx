import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase'
import { Menu, Container } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import AdminMenu from '../Menus/AdminMenu';
import { openModal } from '../../modals/modalActions'

const actions = {
  openModal
}

const mapState = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
})

class NavBar extends Component {

  handleSignIn = () => {
    this.props.openModal('LoginModal')
  };

  handleRegister = () => {
    this.props.openModal('RegisterModal')
  }

  handleDrive = () => {
    this.props.openModal('DriveModal')
  }

  handleSignOut = () => {
    this.props.firebase.logout();
    this.props.history.push('/')
  };

  render() {
    const { auth, profile} = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;
    const isDriver = profile.role === "driver";
    const isUser = profile.role === "user";

    return (
      <Menu fixed="top">
        <Container>
          <Menu.Item as={Link} to="/" header>
            <img src="/assets/logo.png" alt="logo" />
          </Menu.Item>
          { authenticated && isUser && 
              <Menu.Item as={NavLink} to="/subscriptions" name="Subscriptions" /> }
          { isDriver &&
              <Menu.Item as={NavLink} to={"/driver/" + this.props.profile.driverId} name="My Driving Details" />}

          { authenticated && isUser && !profile.subscriptionId &&
            <Menu.Item as={NavLink} to="/addSubcription" name="Subscribe" />}

          { authenticated && profile.isAdmin &&
              <AdminMenu auth={auth} profile={profile} />}

          {authenticated ? (
            <SignedInMenu auth={auth} profile={profile} signOut={this.handleSignOut} />
          ) : (
            <SignedOutMenu register={this.handleRegister} drive={this.handleDrive} signIn={this.handleSignIn} />
          )}
        </Container>
      </Menu>
    );
  }
}

export default withRouter(withFirebase(connect(mapState, actions)(NavBar)));
