import React from 'react';
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

const AdminMenu = ({profile, auth}) => {
  return (
    <Menu.Item position="right">
      <Dropdown pointing="top left" text="Admin Menu">
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={"/manageSubscriptions"} text="Manage Subscription" icon="money" />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default AdminMenu;
