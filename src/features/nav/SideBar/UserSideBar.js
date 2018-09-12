import React from 'react';
import { Grid, Menu, Header, Sticky } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom'

const AdminSideBar = ({ auth, profile, contextRef }) => {
    const isDriver = profile.role === "driver";
    const authenticated = auth.isLoaded && !auth.isEmpty;
  return (
    <Sticky context={contextRef} offset={100}>
      <Menu vertical>
        <Header icon="user" attached inverted color="grey" content="User Menu" />
        { authenticated &&
            <Menu.Item as={NavLink} to='/'>Subscriptions</Menu.Item> }
        { isDriver &&
            <Menu.Item as={NavLink} to={"/driver/" + profile.driverId}>My Driving Details</Menu.Item> }
        { authenticated && !isDriver &&
            <Menu.Item as={NavLink} to='/becomeDriver'>Become a Driver</Menu.Item> }
        { authenticated && !profile.subscriptionId &&
            <Menu.Item as={NavLink} to='/addSubcription'>Subscribe</Menu.Item> }
        { authenticated && !profile.isAdmin &&
            <Menu.Item as={NavLink} to='/manageSubscriptions'>Manage Subscription</Menu.Item> }
      </Menu>
    </Sticky>
  );
};

export default AdminSideBar;
