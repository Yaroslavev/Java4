import React from 'react';
import {Table} from 'flowbite-react';
import {APP_ENV} from "../env";
import {Link} from "react-router-dom";
import {useGetAllProductsQuery} from "../service/ProductsApi.ts";

const ProductsPage: React.FC = () => {
    const {data: products, error, isLoading} = useGetAllProductsQuery();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error occurred while fetching categories.</p>;

    return (
        <>
            <h1 className="text-4xl text-center font-bold text-blue-700 shadow-lg p-6 bg-opacity-50 rounded-lg">
                Продукти
            </h1>
            {/* Кнопка для переходу на сторінку створення категорії */}
            <div className="flex justify-start mb-6">
                <Link
                    to="create" // Вказуємо маршрут для створення категорії
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                >
                    Створити продукт
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
                        {products?.map((product) => (
                            <Table.Row key={product.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {product.name}
                                </Table.Cell>
                                <Table.Cell>
                                    <img
                                        src={`${APP_ENV.REMOTE_BASE_URL}/images/${product.image}`}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </Table.Cell>
                                <Table.Cell>{product.cost}</Table.Cell>
                                <Table.Cell>{product.category}</Table.Cell>
                                <Table.Cell>
                                    <a href="#"
                                       className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                        Змінити
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </>
    );
};

export default ProductsPage;