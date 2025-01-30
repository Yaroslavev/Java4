import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../service/ProductsApi.ts';
import { useGetAllCategoriesQuery } from '../service/CategoriesApi.ts';
import { ProductCreate } from "../models/Product.ts";
import {APP_ENV} from "../env";
import {ArrowUpTrayIcon} from "@heroicons/react/16/solid";

const EditProductPage: React.FC = () => {
    const { id } = useParams();
    const { data: getProduct, isLoading: getProductIsLoading, error: getProductError } = useGetProductByIdQuery(id);
    const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
    const [updateProduct, { isLoading: isUpdateLoading, error: updateError }] = useUpdateProductMutation();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductCreate>({
        name: '',
        cost: 0,
        categoryId: 1,
        image: null as File | null,
    });

    useEffect(() => {
        if (getProduct) {
            setProduct({
                name: getProduct.name,
                cost: getProduct.cost,
                categoryId: getProduct.category.id,
                image: null,
            });
        }
    }, [getProduct]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('cost', product.cost.toString());
        formData.append('categoryId', product.categoryId.toString());
        if (product.image) {
            formData.append('image', product.image);
        }

        try {
            await updateProduct({ id, body: formData }).unwrap();
            navigate(`..`);
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProduct((prevProduct) => ({
                ...prevProduct,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    if (getProductIsLoading || isCategoriesLoading) {
        return (<div>Loading...</div>);
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-gray-900 text-2xl font-bold text-center mb-6">Оновити Продукт</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">
                        Назва Продукту
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
                        {product.imagePreview || getProduct.image ? (
                            <img
                                src={product.imagePreview || `${APP_ENV.REMOTE_BASE_URL}/images/${product.image ? product.image : getProduct.image}`}
                                alt={getProduct.image}
                                className="text-gray-900 m-1 w-1/6 h-auto rounded"
                            />
                        ) : (<span></span>)}
                        <label
                            htmlFor="image"
                            className="cursor-pointer p-2 m-1 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-blue-600"
                        >
                            <ArrowUpTrayIcon className="w-10 h-10" />
                        </label>
                        <input
                            id="image"
                            name="image"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden text-gray-900 w-full m-1 border border-gray-300 rounded mt-2"
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isUpdateLoading}
                        className="bg-blue-500 text-white font-semibold p-2 rounded w-full md:w-1/2 mt-4 hover:bg-blue-600"
                    >
                        {isUpdateLoading ? 'Оновлення...' : 'Оновити Продукт'}
                    </button>
                </div>

                {updateError && <p className="text-red-500 mt-2">Помилка при оновленні продукту!</p>}
                {categoriesError && <p className="text-red-500 mt-2">Помилка при завантаженні категорій!</p>}
            </form>
        </div>
    );
};

export default EditProductPage;
