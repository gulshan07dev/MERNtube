import Layout from "../../layout/Layout";
import AuthForm from "../../component/authForm/authForm";

export default function Login() {
  const handleLogin = ({ email, password }) => {
    console.log("Logging in with:", email, password);
  };

  return (
    <Layout isShowNavigationBar={false} className="flex justify-center pt-24">
      <AuthForm isLogin={true} handleSubmit={handleLogin} />
    </Layout>
  );
}
