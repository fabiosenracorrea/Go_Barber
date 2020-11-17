import React from 'react';
import { FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

import logoImg from '../../assets/images/logo.svg';
import { HeaderContainer, HeaderContent, Profile } from './styles';

const Header: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="GoBarber Logo" />

        <Profile>
          <img src={user.avatar} alt="User" />

          <div>
            <span>Bem-vindo,</span>

            <Link to="/profile">
              <strong>{user.name}</strong>
            </Link>
          </div>
        </Profile>

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
