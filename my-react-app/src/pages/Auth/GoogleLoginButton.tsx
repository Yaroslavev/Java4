import {LoginButtonProps} from "../../models/Auth.ts";
import {useGoogleLogin} from "@react-oauth/google";
import {Button} from "antd";

const GoogleLoginButton: React.FC<LoginButtonProps> = ({ onLogin, title, icon }) => {
    const login = useGoogleLogin({
        onSuccess: async (authCodeResponse) => {
            console.log("Login google token: ", authCodeResponse.access_token);
            onLogin(authCodeResponse.access_token);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return <Button icon={icon} onClick={ () => login() }>{title}</Button>
};

export default GoogleLoginButton;