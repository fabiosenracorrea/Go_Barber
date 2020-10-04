import React, { ButtonHTMLAttributes } from 'react';

import { StyledButton } from './styles';

type CustomButton = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<CustomButton> = ({ children, ...rest }) => {
  return (
    <StyledButton type="button" {...rest}>
      {children}
    </StyledButton>
  );
};
export default Button;
