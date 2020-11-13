import React, { ButtonHTMLAttributes } from 'react';

import { StyledButton } from './styles';

type CustomButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<CustomButton> = ({ children, loading, ...rest }) => {
  return (
    <StyledButton disabled={loading} type="button" {...rest}>
      {loading ? 'Carregando...' : children}
    </StyledButton>
  );
};
export default Button;
