import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { StyledInput, Container, ToolTipContainer } from './styles';

interface CustomInput extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<CustomInput> = ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { defaultValue, fieldName, registerField, error } = useField(name);
  const [isFocusOn, setIsFocusOn] = useState(false);
  const [isFilled, setisFilled] = useState(false);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleInputBlur = useCallback(() => {
    setIsFocusOn(false);

    setisFilled(!!inputRef.current?.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocusOn(true);
  }, []);

  return (
    <>
      <Container
        hasError={!!error}
        focusOn={isFocusOn}
        hasText={isFilled}
        data-testid="input-container"
      >
        {Icon && <Icon size={20} />}
        <StyledInput
          ref={inputRef}
          name={name}
          defaultValue={defaultValue}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          {...rest}
        />
        {error && (
          <ToolTipContainer title={error}>
            <FiAlertCircle size={20} />
          </ToolTipContainer>
        )}
      </Container>
    </>
  );
};
export default Input;
