import React, { useState } from 'react';
import { Table } from 'flowbite-react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useDeleteCategoryMutation, useGetAllCategoriesQuery} from "../service/CategoriesApi.ts";

const CategoriesPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const { data: categories, error, isLoading } = useGetAllCategoriesQuery();
    const [deleteCategory, { isLoading: deleteIsLoading }] = useDeleteCategoryMutation();

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id).unwrap();
            toast.success('Категорію успішно видалено!', { position: "top-right" });
            setShowModal(false); // Закрити модальне вікно після видалення
        } catch (err) {
            toast.error('Сталася помилка при видаленні!', { position: "top-right" });
            setShowModal(false);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Помилка при завантаженні категорій</p>;

    return (
        <>
            <h1 className="text-4xl text-center font-bold text-blue-700 shadow-lg p-6 bg-opacity-50 rounded-lg">
                Категорії
            </h1>

            <div className="flex justify-start mb-6">
                <Link
                    to="create"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                >
                    Додати категорію
                </Link>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Назва</Table.HeadCell>
                        <Table.HeadCell>Дії</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {categories?.map((category) => (
                            <Table.Row key={category.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {category.name}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    <Link
                                        to={`edit/${category.id}`}
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                        Змінити
                                    </Link>
                                    <button
                                        onClick={() => { setCategoryToDelete(category.id); setShowModal(true); }}
                                        className="text-red-600 hover:underline ml-4"
                                    >
                                        Видалити
                                    </button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            {showModal && categoryToDelete !== null && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h3 className="text-black text-lg font-bold">Ви впевнені, що хочете видалити цю категорію?</h3>
                        <div className="mt-4">
                            <button
                                onClick={() => handleDelete(categoryToDelete)}
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

export default CategoriesPage;
