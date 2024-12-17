'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    DataGrid,
    DataGridHeader,
    DataGridRow,
    DataGridHeaderCell,
    DataGridCell,
    DataGridBody,
    TableColumnDefinition,
    createTableColumn,
    Button,
    Input,
} from '@fluentui/react-components';
import { apiManager } from '@/services';
import { Order } from '@/types/order';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout';

const OrdersPage: React.FC = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id; // Get the client ID from the URL
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery); // State for debounced search query

    useEffect(() => {
        console.log("fetchOrders")
        if (id) {
            fetchOrders();
        }
    }, [id, currentPage, debouncedSearchQuery]); // Add currentPage to the dependency array

    useEffect(() => {
        console.log("searchQuery")

        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300); // Debounce time in milliseconds

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const fetchOrders = async () => {
        try {
            if (debouncedSearchQuery.length == 0) {
                const fetchedOrders = await apiManager.getOrders(
                    Number(id),
                    (currentPage - 1) * itemsPerPage,
                    itemsPerPage,
                    searchParams.get('group'));
                setOrders(orders => [...orders, ...fetchedOrders]);
            } else {
                const fetchedOrders = await apiManager.getOrderByCode(Number(id),
                    debouncedSearchQuery, (currentPage - 1) * itemsPerPage, itemsPerPage); // Pass pagination parameters
                setOrders(fetchedOrders);
            }

        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNextPage = () => {
        setCurrentPage(page => page + 1);
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setDebouncedSearchQuery(searchQuery); // Trigger search on Enter key
        }
    };

    const columns: TableColumnDefinition<Order>[] = [
        createTableColumn<Order>({
            columnId: 'code',
            compare: (a, b) => a.code - b.code,
            renderHeaderCell: () => 'Код',
            renderCell: (item) => item.code,
        }),
        createTableColumn<Order>({
            columnId: 'status',
            compare: (a, b) => a.status.localeCompare(b.status),
            renderHeaderCell: () => 'Статус',
            renderCell: (item) => item.status,
        }),
        createTableColumn<Order>({
            columnId: 'state',
            compare: (a, b) => a.state.localeCompare(b.state),
            renderHeaderCell: () => 'Состояние',
            renderCell: (item) => item.state,
        }),
        createTableColumn<Order>({
            columnId: 'phone',
            compare: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
            renderHeaderCell: () => 'Телефон',
            renderCell: (item) => item.phone || 'N/A',
        }),
        createTableColumn<Order>({
            columnId: 'is_sended',
            compare: (a, b) => (a.is_sended === b.is_sended ? 0 : a.is_sended ? 1 : -1),
            renderHeaderCell: () => 'Отправлено?',
            renderCell: (item) => item.is_sended ? 'Yes' : 'No',
        }),
        createTableColumn<Order>({
            columnId: 'created_at',
            compare: (a, b) => (a.created_at?.getTime() || 0) - (b.created_at?.getTime() || 0),
            renderHeaderCell: () => 'Создано в',
            renderCell: (item) => {
                const createdAt = item.created_at ? new Date(item.created_at) : null; // Ensure created_at is a Date object
                return createdAt
                    ? `${createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour12: false, minute: '2-digit', hour: '2-digit' })}`
                    : 'N/A'; // Format without seconds
            },
        }),
        // Add more columns as needed for other order fields
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BackButtonLayout title='Заказы'>
            <div style={{ marginBottom: '1rem' }}>
                <Input
                    type="text"
                    placeholder="Поиск по коду."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                    onKeyDown={handleKeyDown} // Handle Enter key press
                    style={{ marginRight: '1rem' }}
                />
                {/* <Button appearance="primary" onClick={() => router.push(`/client/${id}/orders/create`)}>
                    Add New Order
                </Button> */}
            </div>
            <DataGrid
                items={orders}
                columns={columns}
                sortable
            >
                <DataGridHeader>
                    <DataGridRow>
                        {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                        )}
                    </DataGridRow>
                </DataGridHeader>
                <DataGridBody<Order>>
                    {({ item, rowId }) => (
                        <DataGridRow<Order>
                            key={rowId}
                        >
                            {({ renderCell }) => (
                                <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    )}
                </DataGridBody>
            </DataGrid>
            <div style={{ textAlign: 'center', paddingTop: '12px' }}>
                <Button onClick={() => loadNextPage()}>
                    Загрузить больше
                </Button>
            </div>
        </BackButtonLayout>
    );
};

export default OrdersPage;
