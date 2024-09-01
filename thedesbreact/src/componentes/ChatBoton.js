import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import '../css/ChatButton.css'; // Asegúrate de crear y enlazar el archivo CSS

const ChatButton = ({ onClick }) => {
  return (
    <Button className="chat-button" onClick={onClick}>
      <FontAwesomeIcon icon={faComments} />
    </Button>
  );
};

export default ChatButton;
