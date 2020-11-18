import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiUser, FiLock, FiCamera } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import getValidationErros from '../../utils/getValidationErros';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';

interface FormData {
  email: string;
  name: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: FormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().min(6, '6 ou mais dígitos'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().min(6, '6 ou mais dígitos'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'Confirmação Incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(data.old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const { data: newUserInfo } = await api.put('/profile', formData);

        updateUser(newUserInfo);

        addToast({
          title: 'Perfil atualizado!',
          description: 'Suas informações foram salvas com sucesso!',
          type: 'success',
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          title: 'Erro ao atualizar o seu perfil',
          description: 'Tente novamente em alguns instantes.',
          type: 'error',
        });
      }
    },
    [addToast, history],
  );

  const handleAvatarChange = useCallback(
    async (fileEvent: ChangeEvent<HTMLInputElement>) => {
      if (fileEvent.target.files) {
        try {
          const avatarData = new FormData();

          avatarData.append('avatar', fileEvent.target.files[0]);

          const { data: newUserInfo } = await api.patch(
            'users/avatar',
            avatarData,
          );

          updateUser(newUserInfo);

          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
          });
        } catch {
          addToast({
            type: 'error',
            title: 'Ocorreu um erro ao atualizar o seu avatar',
            description: 'Tente novamente em alguns instantes.',
          });
        }
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="off"
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            <img src={user.avatar} alt={user.name} />

            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input icon={FiUser} name="name" placeholder="Nome" />

          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <Input
            icon={FiLock}
            name="old_password"
            type="password"
            placeholder="Senha atual"
          />

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
            placeholder="Confirmar nova senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
