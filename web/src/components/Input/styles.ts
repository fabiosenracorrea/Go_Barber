import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ControlProps {
  focusOn: boolean;
  hasText: boolean;
  hasError: boolean;
}

export const Container = styled.div<ControlProps>`
  display: flex;
  align-items: center;
  background-color: #232129;
  border-radius: 10px;
  padding: 0 16px;
  border: 2px solid #232129;
  color: #666360;

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: #c53030;
    `}

  ${({ focusOn }) =>
    focusOn &&
    css`
      border-color: #ff9000;
    `}

  & + div {
    margin-top: 12px;
  }

  svg {
    ${({ focusOn, hasText }) =>
      (focusOn || hasText) &&
      css`
        color: #ff9000;
      `}
  }
`;

export const StyledInput = styled.input`
  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 16px;
  width: 100%;
  color: #f4ede8;

  &::placeholder {
    color: #666360;
  }
`;

export const ToolTipContainer = styled(Tooltip)`
  span {
    background-color: #c53030;
    color: #f4ede8;

    &:before {
      border-color: #c53030 transparent;
    }
  }
`;
