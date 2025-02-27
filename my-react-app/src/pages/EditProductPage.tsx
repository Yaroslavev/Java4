import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../service/ProductsApi.ts';
import { useGetAllCategoriesQuery } from '../service/CategoriesApi.ts';
import { ProductCreate } from "../models/Product.ts";
import { APP_ENV } from "../env";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableImage: React.FC<{ preview: string; index: number; onRemove: (index: number) => void }> = ({ preview, index, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `${index}-${preview}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative m-1 border border-gray-300 rounded"
        >
            <img
                src={preview}
                alt={`Preview ${index}`}
                className="m-1 max-h-[50px] rounded cursor-move hover:filter hover:brightness-75 transition duration-200"
                onClick={() => onRemove(index)}
            />
        </div>
    );
};

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
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        if (getProduct) {
            const oldImages = getProduct.images.map(img => `${APP_ENV.REMOTE_BASE_URL}/images/${img.image}`);
            convertUrlsToFiles(oldImages).then((oldFiles) => {
                setProduct({
                    name: getProduct.name,
                    cost: getProduct.cost,
                    categoryId: getProduct.category.id,
                    images: oldFiles,
                });
                setImagePreviews(oldImages);
            });
        }
    }, [getProduct]);

    const convertUrlsToFiles = async (urls: string[]): Promise<File[]> => {
        const filePromises = urls.map(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const fileName = url.split('/').pop() || 'image';
            return new File([blob], fileName, { type: blob.type });
        });
        return Promise.all(filePromises);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('cost', product.cost.toString());
        formData.append('categoryId', product.categoryId.toString());
        product.images.forEach((file) => {
            formData.append('images', file);
        });

        try {
            await updateProduct({ id, body: formData }).unwrap();
            navigate(`..`);
        } catch (err) {
            console.error('Помилка при оновленні продукта', err);
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
        });
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = imagePreviews.findIndex((_, i) => `${i}-${imagePreviews[i]}` === active.id);
            const newIndex = imagePreviews.findIndex((_, i) => `${i}-${imagePreviews[i]}` === over.id);

            const newImages = [...product.images];
            const newPreviews = [...imagePreviews];

            const [draggedImage] = newImages.splice(oldIndex, 1);
            newImages.splice(newIndex, 0, draggedImage);

            const [draggedPreview] = newPreviews.splice(oldIndex, 1);
            newPreviews.splice(newIndex, 0, draggedPreview);

            setProduct((prev) => ({ ...prev, images: newImages }));
            setImagePreviews(newPreviews);
        }
    };

    if (getProductIsLoading || isCategoriesLoading) {
        return <div>Loading...</div>;
    }

    if (getProductError || categoriesError) {
        return <div>Error loading product or categories</div>;
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
                        min="0"
                        step="0.01"
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
                    <label className="block text-gray-700" htmlFor="images">
                        Зображення Продукта
                    </label>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={imagePreviews.map((preview, index) => `${index}-${preview}`)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex flex-wrap items-center">
                                {imagePreviews.length > 0 &&
                                    imagePreviews.map((preview, index) => (
                                        <SortableImage
                                            key={`${index}-${preview}`}
                                            preview={preview}
                                            index={index}
                                            onRemove={handleRemoveImage}
                                        />
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
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </SortableContext>
                    </DndContext>
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