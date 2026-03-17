import { Navigate } from 'react-router-dom';

export const MemberRoute = ({ user, children }) => {
  if (!user || user.role !== 'member') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AdminRoute = ({ user, children }) => {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};
