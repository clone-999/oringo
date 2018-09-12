import React, { Component } from 'react';
import { Modal, Button, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import { closeModal, openModal } from './modalActions';

const actions = { closeModal, openModal };

class UnauthAdminModal extends Component {

  handleCloseModal = () => { 
    this.props.history.goBack();
    this.props.closeModal();
  }

  render() {
    const { openModal } = this.props;
    return (
      <Modal size="mini" open={true} onClose={this.handleCloseModal}>
        <Modal.Header>You need to be an admin to do that!</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Please either login as an admin to see this page</p>
            
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <p>Or click cancel to continue</p>
              <Button onClick={this.handleCloseModal}>Cancel</Button>
            </div>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default withRouter(connect(null, actions)(UnauthAdminModal));
