import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useCreateCategoryMutation} from '../service/CategoriesApi.ts';
import {CategoryCreate} from "../models/CategoryModel.ts";

const CreateCategoryPage: React.FC = () => {
    const [category, setCategory] = useState<CategoryCreate>({
        name: '',
    });

    const [createCategory, { isLoading: isCreateLoading, error: createError }] = useCreateCategoryMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createCategory(category).unwrap();
            navigate(`..`);
        } catch (err) {
            console.error('Помилка при додаванні категорії', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-gray-900 text-2xl font-bold text-center mb-6">Додати Категорії</h1>
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
                        disabled={isCreateLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full md:w-1/2 mt-4"
                    >
                        {isCreateLoading ? 'Додавання...' : 'Додати Категорію'}
                    </button>
                </div>

                {createError && <p className="text-red-500 mt-2">Помилка при додаванні категорії!</p>}
            </form>
        </div>
    );
};

export default CreateCategoryPage;
