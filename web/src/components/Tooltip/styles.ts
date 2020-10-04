import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    position: absolute;
    bottom: calc(100% + 12px);
    background-color: #ff9000;
    color: #312e38;
    width: 140px;
    border-radius: 5px;
    padding: 8px;
    font-size: 14px;

    opacity: 0;
    visibility: hidden;

    left: 50%;
    transform: translateX(-50%);

    &:before {
      content: '';
      border-style: solid;
      border-width: 6px 6px 0 6px;
      position: absolute;
      border-color: #ff9000 transparent;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
