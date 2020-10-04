import React from 'react';
import { useTransition } from 'react-spring';

import { ToastMessageStruct } from '../../hooks/toast';

import SingleToast from './SingleToast';

import { Container } from './styles';

interface ToastProps {
  messages: ToastMessageStruct[];
}

const Toast: React.FC<ToastProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );

  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <SingleToast key={key} message={item} styles={props} />
      ))}
    </Container>
  );
};

export default Toast;
