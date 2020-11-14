import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

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

        setLoading(true);

        await api.post('/password/forgot', {
          email: data.email,
        });

        setLoading(false);

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a sua recuperação de senha, cheque sua caixa de entrada!',
        });
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
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <img src={logo} alt="GoBarber logo" />

        <Form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
          <h1>Recuperar senha</h1>

          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <Button loading={loading} type="submit">
            Recuperar
          </Button>
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
