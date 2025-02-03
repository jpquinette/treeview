import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import { BsCheckCircleFill, BsExclamationTriangleFill } from 'react-icons/bs';
import './Modal.css';

const Modal = ({ show, onClose, type = 'warning', title, message }) => {
  const modalContent = {
    warning: {
      icon: <BsExclamationTriangleFill className="modal-icon warning-bt" />,
      title: 'Limite atteinte',
      message: 'Vous ne pouvez pas sélectionner plus de 500 produits dans le Pack Découverte.',
      buttonVariant: 'primary-bt'
    },
    empty: {
      icon: <BsExclamationTriangleFill className="modal-icon warning-bt" />,
      title: 'Aucune sélection',
      message: 'Veuillez sélectionner au moins une catégorie avant de valider.',
      buttonVariant: 'primary-bt'
    },
    success: {
      icon: <BsCheckCircleFill className="modal-icon success-bt" />,
      title: 'Succès',
      message: 'Vos modifications ont été enregistrées avec succès !',
      buttonVariant: 'success-bt'
    }
  };

  const content = modalContent[type];

  return (
    <BootstrapModal 
      show={show} 
      onHide={onClose} 
      centered
      backdrop="static"
      keyboard={false}
      className="custom-modal-bt"
      dialogClassName="modal-dialog-bt"
    >
      <BootstrapModal.Header closeButton className="modal-header">
        <BootstrapModal.Title className="modal-title-bt">{title || content.title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body className="modal-body-bt">
        <div className="modal-content-wrapper-bt">
          {content.icon}
          <p>{message || content.message}</p>
        </div>
      </BootstrapModal.Body>
      <BootstrapModal.Footer className="modal-footer-bt">
        <button className={`btn-bt btn-${content.buttonVariant}`} onClick={onClose}>
          {type === 'success' ? 'Fermer' : 'Compris'}
        </button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default Modal;