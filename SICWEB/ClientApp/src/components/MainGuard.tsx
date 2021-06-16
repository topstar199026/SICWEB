import type { FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';

interface MainGuardProps {
  children?: ReactNode;
}

const MainGuard: FC<MainGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/app/dashboard" />;
  }else{
    return <Redirect to="login" />;
  }
};

MainGuard.propTypes = {
  children: PropTypes.node
};

export default MainGuard;
