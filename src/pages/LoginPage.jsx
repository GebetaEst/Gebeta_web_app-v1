import AuthLayout from "../Layouts/AuthLayout";
import LoginForm from "../components/AuthForms/LoginForm";
const LoginPage = () => {
  return (
    <>
      <AuthLayout>
        <div className="  translate-x-[200px] motion-preset-slide-right ">
          <LoginForm />
        </div>
        <div className="bg-[url('/src/assets/images/Login.jpg')] bg-contain bg-no-repeat bg-center md:h-[600px] h-[580px] lg:w-[400px] w-[440px] rounded-xl shadow-2xl shadow-black/50"></div>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
