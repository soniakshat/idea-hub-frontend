// src/pages/Page404.jsx
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function Page404() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist or you are not authorized to view it.</p>
      <Button type="primary" onClick={handleGoHome}>
        Go to Login
      </Button>
    </div>
  );
}

export default Page404;
