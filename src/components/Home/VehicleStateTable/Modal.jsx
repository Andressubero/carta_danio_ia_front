import Modal from 'react-modal';
import './Modal.css';

Modal.setAppElement('#root');

function ModalComponent({ isOpen, setIsOpen, children }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Ejemplo"
      overlayClassName="modal-overlay"
      className="modal-content"
    >
      <button onClick={() => setIsOpen(false)} className="modal-close-button">✖</button>
      {children}
    </Modal>
  );
}

export { ModalComponent };

