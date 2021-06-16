import type { FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';

interface GuestGuardProps {
  children?: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/app/dashboard" />;
  }

  return (
    <>
      {children}
    </>
  );
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
