import './App.css'
import {Button} from "flowbite-react";
import {APP_ENV} from "./env";
import {useEffect, useState} from "react";
import axios from "axios";

import {Table} from "flowbite-react";
import {CategoryModel} from "./models/CategoryModel.ts";
import {useGetAllCategoriesQuery} from "./service/CategoriesApi.ts";

function App() {
    const { data: categories, error, isLoading } = useGetAllCategoriesQuery();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error occurred while fetching categories.</p>;

    return (
        <>
            <h1 className="text-3xl font-bold pb-10">
                Категорії
            </h1>

            <div className="overflow-x-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Id</Table.HeadCell>
                        <Table.HeadCell>Назва</Table.HeadCell>
                        <Table.HeadCell>Фото</Table.HeadCell>
                        <Table.HeadCell>Опис</Table.HeadCell>
                        <Table.HeadCell>Дії</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {categories?.map((category: CategoryModel) => (
                            <Table.Row key={category.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{category.id}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {category.name}
                                </Table.Cell>
                                <Table.Cell>{category.image}</Table.Cell>
                                <Table.Cell>{category.description}</Table.Cell>
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
    )
}

export default App