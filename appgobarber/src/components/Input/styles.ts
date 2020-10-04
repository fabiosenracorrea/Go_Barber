import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface ContainerProps {
  hasFocus: boolean;
  hasError: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background-color: #232139;
  border-radius: 10px;
  margin-bottom: 12px;

  flex-direction: row;
  align-items: center;

  border-width: 1px;
  border-color: #232139;

  ${({ hasError }) =>
    hasError &&
    css`
      border-width: 1px;
      border-color: #c53030;
    `}

  ${({ hasFocus }) =>
    hasFocus &&
    css`
      border-width: 1px;
      border-color: #ff9000;
    `}
`;

export const CustomTextInput = styled(TextInput)`
  flex: 1;
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
