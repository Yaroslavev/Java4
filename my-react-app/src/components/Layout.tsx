import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearToken } from '../slices/AuthSlice.ts';

const Layout: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const username = useSelector((state) => state.auth.username);

    const handleLogout = () => {
        dispatch(clearToken());
        navigate('/auth/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-blue-600 text-white p-4">
                <ul className="flex items-center justify-between">
                    <div className="flex space-x-4">
                        <li><Link to="/" className="hover:underline">Головна</Link></li>
                        <li><Link to="/products" className="hover:underline">Продукти</Link></li>
                        <li><Link to="/categories" className="hover:underline">Категорії</Link></li>
                    </div>
                    <div className="flex space-x-4 items-center">
                        {token ? (
                            <>
                                <span className="mr-4">
                                    Вітаємо, {username || 'Користувач'}!
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="hover:underline bg-red-500 px-3 py-1 rounded"
                                >
                                    Вийти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth/login" className="hover:underline">
                                    Увійти
                                </Link>
                                <Link to="/auth/register" className="hover:underline">
                                    Зареєструватися
                                </Link>
                            </>
                        )}
                    </div>
                </ul>
            </nav>
            <main className="flex-1 p-4">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white text-center p-4">
                © 2025 My Store
            </footer>
        </div>
    );
};

export default Layout;