import React, { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

import { ToastMessageStruct, useToast } from '../../../hooks/toast';

import { ToastMessage } from './styles';

interface SingleToastProps {
  message: ToastMessageStruct;
  styles: object;
}

const icons = {
  info: <FiInfo size={20} />,
  error: <FiAlertCircle size={20} />,
  success: <FiCheckCircle size={20} />,
};

const SingleToast: React.FC<SingleToastProps> = ({ message, styles }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [removeToast, message.id]);

  return (
    <ToastMessage
      key={message.id}
      hasDescription={Number(!!message.description)}
      type={message.type}
      style={styles}
    >
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(message.id)}>
        <FiX size={20} />
      </button>
    </ToastMessage>
  );
};

export default SingleToast;
