import styled from 'styled-components';
import { shade } from 'polished';

export const StyledButton = styled.button`
  background: #ff9000;
  height: 56px;
  border-radius: 10px;
  border: none;
  padding: 0 16px;
  width: 100%;
  color: #312e38;
  font-weight: 700px;
  margin-top: 24px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }
`;
