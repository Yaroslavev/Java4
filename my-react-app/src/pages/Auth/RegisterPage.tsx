import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from "../../service/AuthApi.ts";
import { setToken } from "../../slices/AuthSlice.ts";
import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const token = await register({
                username: values.username,
                password: values.password,
                email: values.email,
            }).unwrap();
            dispatch(setToken({ token, username: values.username })); // Передаємо token і username
            navigate("/");
            message.success('Реєстрація успішна!');
        } catch (error) {
            const errorMessage = error.data?.message || error.error || 'Невідома помилка';
            message.error('Помилка реєстрації: ' + errorMessage);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Реєстрація</h2>
                <Form name="register" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Ім'я користувача"
                        name="username"
                        rules={[{ required: true, message: "Введіть ім'я користувача!" }]}
                    >
                        <Input placeholder="Введіть username" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Введіть email!" },
                            { type: 'email', message: "Введіть коректний email!" },
                        ]}
                    >
                        <Input placeholder="Введіть email" className="w-full" />
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
                            Зареєструватись
                        </Button>
                    </Form.Item>
                </Form>
                <p className="text-center text-sm text-gray-600">
                    Вже маєте акаунт?{' '}
                    <a href="/auth/login" className="text-blue-500 hover:underline">
                        Увійдіть
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;