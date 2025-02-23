import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCreate } from '../models/Product.ts';
import { useCreateProductMutation } from '../service/ProductsApi.ts';
import { useGetAllCategoriesQuery } from '../service/CategoriesApi.ts';
import {ArrowUpTrayIcon} from "@heroicons/react/16/solid";

const CreateProductPage: React.FC = () => {
    const [product, setProduct] = useState<ProductCreate>({
        name: '',
        cost: 0,
        categoryId: 1,
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
    const [createProduct, { isLoading: isCreateLoading, error: createError }] = useCreateProductMutation();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('cost', product.cost.toString());
        formData.append('categoryId', product.categoryId.toString());

        product.images.forEach((file) => {
            formData.append('images', file);
        })

        try {
            await createProduct(formData).unwrap();
            navigate(`..`);
        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === 'cost' || name === 'categoryId' ? Number(value) : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setProduct((prevProduct) => ({
                ...prevProduct,
                images: [...prevProduct.images, ...files],
            }));
            setImagePreviews((prevPreviews) => [
                ...prevPreviews,
                ...files.map(file => URL.createObjectURL(file)),
            ]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: prevProduct.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prevPreviews) => {
            const newPreviews = prevPreviews.filter((_, i) => i !== index);
            URL.revokeObjectURL(prevPreviews[index]);

            return newPreviews;
        })
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-gray-900 text-2xl font-bold text-center mb-6">Додати Продукт</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">
                        Назва Продукта
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={product.name}
                        onChange={handleChange}
                        className="text-gray-900 w-full p-2 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="cost">
                        Ціна
                    </label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={product.cost}
                        onChange={handleChange}
                        className="text-gray-900 w-full p-2 border border-gray-300 rounded mt-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="categoryId">
                        Категорія
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleChange}
                        className="text-gray-900 w-full p-2 border border-gray-300 rounded mt-2"
                        required
                    >
                        <option disabled value="">Виберіть категорію...</option>
                        {categories && categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="image">
                        Зображення Продукта
                    </label>
                    <div className="flex items-center">
                        {imagePreviews.length > 0 && imagePreviews.map((preview, index) => (
                            <div key={index} className="relative m-1">

                                <img
                                    key={index}
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    className="text-gray-900 m-1 h-14 rounded cursor-pointer hover:filter hover:brightness-75 transition duration-200"
                                    onClick={() => handleRemoveImage(index)}
                                />
                            </div>
                        ))}
                        <label
                            htmlFor="images"
                            className="cursor-pointer p-2 m-1 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-blue-600"
                        >
                            <ArrowUpTrayIcon className="w-10 h-10" />
                        </label>
                        <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden text-gray-900 w-full m-1 border border-gray-300 rounded mt-2"
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isCreateLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full md:w-1/2 mt-4"
                    >
                        {isCreateLoading ? 'Додавання...' : 'Додати Продукт'}
                    </button>
                </div>

                {createError && <p className="text-red-500 mt-2">Помилка при додаванні продукта!</p>}
                {categoriesError && <p className="text-red-500 mt-2">Помилка при завантаженні категорій!</p>}
            </form>
        </div>
    );
};

export default CreateProductPage;