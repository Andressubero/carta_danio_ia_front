import React, { useEffect, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Necesario para accesibilidad

const NavigateModal = ({text, comment, buttonText, onClick, state}) => {
  const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        setIsOpen(state)
    }, [state])
    
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick={false} // Evita cierre al hacer clic fuera
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>{text}</h2>
        <p>{comment}</p>
        <button onClick={() => { onClick(); setIsOpen(false)}}>{buttonText}</button>
      </Modal>
    </div>
  );
};

export {NavigateModal};