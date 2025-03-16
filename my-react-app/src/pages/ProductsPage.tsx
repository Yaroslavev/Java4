import React, { useState } from 'react';
import { Table } from 'flowbite-react';
import { APP_ENV } from "../env";
import { Link } from "react-router-dom";
import { useDeleteProductMutation, useGetAllProductsQuery } from "../service/ProductsApi.ts";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const { data: products, error, isLoading } = useGetAllProductsQuery();
    const [deleteProduct, { isLoading: deleteIsLoading }] = useDeleteProductMutation();

    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id).unwrap();
            toast.success('Продукт успішно видалено!', { position: "top-right" });
            setShowModal(false);
        } catch (err) {
            toast.error('Сталася помилка при видаленні!', { position: "top-right" });
        }
    };

    // Функція для отримання зображення з найменшим пріоритетом
    const getLowestPriorityImage = (images: { id: number; priority: number; image: string }[]) => {
        if (!images || images.length === 0) return null;
        return images.reduce((prev, curr) => (prev.priority < curr.priority ? prev : curr));
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Помилка при завантаженні продуктів</p>;

    return (
        <>
            <h1 className="text-4xl text-center font-bold text-blue-700 shadow-lg p-6 bg-opacity-50 rounded-lg">
                Продукти
            </h1>

            <div className="flex justify-start mb-6">
                <Link
                    to="create"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                >
                    Додати продукт
                </Link>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Назва</Table.HeadCell>
                        <Table.HeadCell>Фото</Table.HeadCell>
                        <Table.HeadCell>Ціна</Table.HeadCell>
                        <Table.HeadCell>Категорія</Table.HeadCell>
                        <Table.HeadCell>Дії</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {products?.map((product) => {
                            const lowestPriorityImage = getLowestPriorityImage(product.images);
                            return (
                                <Table.Row key={product.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {product.name}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {lowestPriorityImage ? (
                                            <img
                                                src={`${APP_ENV.REMOTE_BASE_URL}/images/${lowestPriorityImage.image}`}
                                                alt={product.name}
                                                className="h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <span>Немає фото</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {product.cost}$
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {product.category.name}
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        <Link
                                            to={`edit/${product.id}`}
                                            className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                        >
                                            Змінити
                                        </Link>
                                        <button
                                            onClick={() => { setProductToDelete(product.id); setShowModal(true); }}
                                            className="text-red-600 hover:underline ml-4"
                                        >
                                            Видалити
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </div>

            {showModal && productToDelete !== null && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h3 className="text-black text-lg font-bold">Ви впевнені, що хочете видалити цей продукт?</h3>
                        <div className="mt-4">
                            <button
                                onClick={() => handleDelete(productToDelete)}
                                className="px-4 py-2 bg-red-600 text-white rounded mr-2 hover:bg-red-700 size-1/3"
                                disabled={deleteIsLoading}
                            >
                                {deleteIsLoading ? 'Видалення...' : 'Так, видалити'}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 size-1/3"
                            >
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductsPage;