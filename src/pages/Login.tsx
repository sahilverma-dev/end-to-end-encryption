import Page from "../components/Page";
import { useAuth } from "../context/AuthContext";

// icons
import { FcGoogle as GoogleIcon } from "react-icons/fc";

const Login = () => {
  const { login } = useAuth();
  return (
    <Page className="min-h-screen w-full text-white bg-blue-600 flex flex-col sm:flex-row items-center">
      <div
        className="flex backdrop-opacity-0 items-center flex-grow sm:min-h-screen w-full bg-cover bg-center"
        // style={{
        //   backgroundImage: "url('https://source.unsplash.com/random/?space')",
        // }}
      >
        <div className="p-4 max-w-5xl ml-auto flex flex-col gap-3">
          <p className="font-bold text-3xl">Dear user,</p>
          <p>
            Welcome to end-to-end encryption chat website. This is a basic
            implementation of secure online communication. To enhance the user
            experience, we have integrated Google Login, which will display your
            basic information such as name and avatar on the chat platform.
          </p>
          <p>
            Please note that in order to provide you with the best experience,
            we store your information on Firebase to show your chat history.
            However, we want to make sure that you are fully aware of this and
            give us your consent to share your data. We ask that you only log in
            to our website if you agree to share your information with us.
          </p>
          <p>
            We are committed to protecting your privacy and ensuring that your
            online conversations are secure. If you have any queries, bug
            reports, or suggestions, please do not hesitate to contact us at{" "}
            <a
              href="mailto:sahilverma.webdev@gmail.com"
              className="text-slate-900 font-bold"
            >
              sahilverma.webdev@gmail.com
            </a>
            .
          </p>
          <p>Best regards,</p>
          <p className="font-bold">Sahil Verma</p>
        </div>
      </div>
      <div className="bg-white sm:min-h-screen py-4 w-full max-w-[500px] flex items-center justify-center">
        <button
          onClick={login}
          className=" bg-blue-500 hover:bg-blue-800 transition-all flex items-center gap-2 rounded-md px-2 py-2 pr-4 font-bold text-white shadow"
        >
          <span className="bg-white transition-all p-2 aspect-square rounded shadow border">
            <GoogleIcon />
          </span>
          Login with Google
        </button>
      </div>
    </Page>
  );
};

export default Login;
