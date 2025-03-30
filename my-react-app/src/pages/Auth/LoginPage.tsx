import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import {useGoogleLoginMutation, useLoginMutation} from "../../service/AuthApi.ts";
import { setToken } from "../../slices/AuthSlice.ts";
import {useNavigate} from "react-router-dom";
import {GoogleOAuthProvider} from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton.tsx";
import {HomeIcon} from "@heroicons/react/16/solid";

const LoginPage = () => {
    const [login, { isLoading }] = useLoginMutation();
    const [googleLogin] = useGoogleLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const token = await login({
                username: values.username,
                password: values.password,
            }).unwrap();
            dispatch(setToken({ token, username: values.username }));
            navigate("/");
            message.success('Успішний вхід!');
        } catch (error) {
            const errorMessage = error.data?.message || error.error || 'Неправильний логін або пароль';
            message.error('Помилка входу: ' + errorMessage);
        }
    };

    const onLoginGoogle = async (googleToken: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Google API error: ${response.status}`);
            }

            const userInfo = await response.json();
            const username = userInfo.name || userInfo.email || "default_user";
            const token = await googleLogin({
                token: googleToken,
            }).unwrap();
            dispatch(setToken({ token, username: username }));
            navigate("/");
            message.success('Успішний вхід!');
        } catch (error) {
            console.log(error);
            message.error('Помилка входу');
        }
    }

    return (
        <GoogleOAuthProvider clientId={"688315354046-isd3q5qkjaj88uaj9oudrldsf18bm592.apps.googleusercontent.com"}>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">Вхід</h2>
                    <Form name="login" onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="Ім'я користувача"
                            name="username"
                            rules={[{ required: true, message: "Введіть ім'я користувача!" }]}
                        >
                            <Input placeholder="Введіть username" className="w-full" />
                        </Form.Item>

                        <Form.Item
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: "Введіть пароль!" }]}
                        >
                            <Input.Password placeholder="Введіть пароль" className="w-full" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                className="w-full bg-blue-500 hover:bg-blue-600"
                            >
                                Увійти
                            </Button>
                        </Form.Item>
                        
                        <GoogleLoginButton title={"Увійти з Google"} onLogin={onLoginGoogle} icon={<HomeIcon />} />
                    </Form>
                    <p className="text-center text-sm text-gray-600">
                        Немає акаунта?{' '}
                        <a href="/auth/register" className="text-blue-500 hover:underline">
                            Зареєструйтесь
                        </a>
                    </p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPage;