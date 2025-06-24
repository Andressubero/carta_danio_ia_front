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
      className="modal-content rounded-4"
    >
      <button onClick={() => setIsOpen(false)} className="modal-close-button">✖</button>
      <br />
      <div className='w-100 modal-content-container'>
        {children}
      </div>
    </Modal>
  );
}

export { ModalComponent };

