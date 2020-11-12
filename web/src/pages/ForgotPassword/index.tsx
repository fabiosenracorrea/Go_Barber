import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErros';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';
import logo from '../../assets/images/logo.svg';

interface ForgotFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ForgotFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Digite seu e-mail')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        api.post('/password/forgot', data);

        // history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha',
          type: 'error',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Content>
        <img src={logo} alt="GoBarber logo" />

        <Form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
          <h1>Recuperar senha</h1>

          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <Button type="submit">Entrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft size={20} />
          Voltar ao Login
        </Link>
      </Content>

      <Background />
    </Container>
  );
};

export default ForgotPassword;
