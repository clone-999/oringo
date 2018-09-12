import React, {Component} from 'react';
import {Modal} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {closeModal} from "./modalActions";
import DriveForm from "../auth/Drive/DriveForm";

const actions = {closeModal};

class DriveModal extends Component {
    render() {
        return (
            <Modal
                size='mini'
                open={true}
                onClose={this.props.closeModal}
            >
                <Modal.Header>
                    Become a Driver at Oringo!
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <DriveForm />
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

export default connect(null, actions)(DriveModal);
