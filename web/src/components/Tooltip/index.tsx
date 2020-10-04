import React from 'react';

import { Container } from './styles';

interface ToolTipProps {
  title: string;
  className?: string;
}

const Tooltip: React.FC<ToolTipProps> = ({ title, className, children }) => {
  return (
    <Container className={className}>
      <span>{title}</span>
      {children}
    </Container>
  );
};

export default Tooltip;
