import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Input from '../../components/Input';

const inputName = 'email';
const placeholder = 'E-mail';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: inputName,
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component testing', () => {
  it('should display a text input on screen', () => {
    const screen = render(<Input name={inputName} placeholder={placeholder} />);

    expect(screen.getByPlaceholderText(placeholder)).toBeTruthy();
  });

  it('should render a highlight on input focus', async () => {
    const screen = render(<Input name={inputName} placeholder={placeholder} />);

    const inputElement = screen.getByPlaceholderText(placeholder);
    const containerBeforeFocus = screen.getByTestId('input-container');

    fireEvent.focus(inputElement);

    const expectedBorderStyle = 'border-color: #ff9000;';

    expect(containerBeforeFocus).not.toHaveStyle(expectedBorderStyle);

    const containerAfterFocus = screen.getByTestId('input-container');

    await waitFor(() => {
      expect(containerAfterFocus).toHaveStyle(expectedBorderStyle);
    });
  });

  it('should not render a highlight on input blur', async () => {
    const screen = render(<Input name={inputName} placeholder={placeholder} />);

    const inputElement = screen.getByPlaceholderText(placeholder);

    fireEvent.focus(inputElement);
    fireEvent.blur(inputElement);

    const expectedBorderStyle = 'border-color: #ff9000;';
    const containerElement = screen.getByTestId('input-container');

    await waitFor(() => {
      expect(containerElement).not.toHaveStyle(expectedBorderStyle);
    });
  });
});
