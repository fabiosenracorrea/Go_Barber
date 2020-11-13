import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErros';

import logo from '../../assets/images/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

interface FormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: FormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().min(6, '6 ou mais dígitos'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Confirmação Incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        addToast({
          title: 'Senha recuperada com sucesso!',
          description: 'Você já pode fazer o seu logon no GoBarber!',
          type: 'success',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          title: 'Erro ao resetar senha',
          description: 'Tente novamente em alguns instantes.',
          type: 'error',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Background />

      <Content>
        <img src={logo} alt="GoBarber logo" />

        <Form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
          <h1>Recupere sua Senha</h1>

          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Nova senha"
          />

          <Input
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="Confirmação de senha"
          />

          <Button type="submit">Alterar senha</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default ResetPassword;
