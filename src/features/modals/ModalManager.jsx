import React from 'react'
import { connect } from 'react-redux'
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal'
import DriveModal from './DriveModal'
import UnauthModal from './UnauthModal'
import UnauthDriverModal from './UnauthDriverModal'
import UnauthAdminModal from './UnauthAdminModal'
import UnauthCustomerModal from './UnauthCustomerModal'

const modalLookup = {
  LoginModal,
  RegisterModal,
  DriveModal,
  UnauthModal,
  UnauthCustomerModal,
  UnauthDriverModal,
  UnauthAdminModal
}

const mapState = (state) => ({
  currentModal: state.modals
})

const ModalManager = ({currentModal}) => {
  let renderedModal;

  if (currentModal) {
    const {modalType, modalProps} = currentModal;
    const ModalComponent = modalLookup[modalType];

    renderedModal = <ModalComponent {...modalProps}/>
  }
  return <span>{renderedModal}</span>
}

export default connect(mapState)(ModalManager)
