import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../service/ProductsApi.ts';
import {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation
} from '../service/CategoriesApi.ts';
import { ProductCreate } from "../models/Product.ts";
import {APP_ENV} from "../env";
import {ArrowUpTrayIcon} from "@heroicons/react/16/solid";
import {CategoryCreate} from "../models/CategoryModel.ts";

const EditCategoryPage: React.FC = () => {
    const { id } = useParams();
    const { data: getCategory, isLoading: getCategoryIsLoading, error: getCategoryError } = useGetCategoryByIdQuery(id);
    const [updateCategory, { isLoading: isUpdateLoading, error: updateError }] = useUpdateCategoryMutation();
    const navigate = useNavigate();

    const [category, setCategory] = useState<CategoryCreate>({
        name: '',
    });

    useEffect(() => {
        if (getCategory) {
            setCategory({
                name: getCategory.name,
            });
        }
    }, [getCategory]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateCategory({ id, category }).unwrap();
            navigate(`..`);
        } catch (err) {
            console.error('Помилка при оновленні категорії', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    if (getCategoryIsLoading) {
        return (<div>Loading...</div>);
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-gray-900 text-2xl font-bold text-center mb-6">Оновити Категорію</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">
                        Назва Категорії
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={category.name}
                        onChange={handleChange}
                        className="text-gray-900 w-full p-2 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isUpdateLoading}
                        className="bg-blue-500 text-white font-semibold p-2 rounded w-full md:w-1/2 mt-4 hover:bg-blue-600"
                    >
                        {isUpdateLoading ? 'Оновлення...' : 'Оновити Категорію'}
                    </button>
                </div>

                {updateError && <p className="text-red-500 mt-2">Помилка при оновленні категорії!</p>}
            </form>
        </div>
    );
};

export default EditCategoryPage;
