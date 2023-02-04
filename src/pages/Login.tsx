import Page from "../components/Page";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  return (
    <Page>
      <button onClick={login}>Login</button>
    </Page>
  );
};

export default Login;
