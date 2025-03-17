'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    Badge,
    Select,
    Label,
    Spinner,
    Card,
} from '@fluentui/react-components';
import { Stack } from '@fluentui/react'
import { apiManager } from '@/services';
import { Order } from '@/types/order';

const OrdersDashboard: React.FC<{
    user_id: number;
    group_id?: number;
    customer_id?: number;
    filters?: boolean
    customer_info?: boolean
}> = ({ user_id, group_id, customer_id, filters = true, customer_info = true }) => {
    console.log(customer_info)
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery); // State for debounced search query
    const [statusFilter, setStatusFilter] = useState<string>(''); // New state for status filter

    // Status options based on the StatusGroup enum
    const statusOptions = [
        { key: '', value: '', text: 'Все статусы' },
        { key: 'delivery', value: 'Доставка', text: 'Доставка' },
        { key: 'delivery_kaspi', value: 'Доставка каспи', text: 'Доставка каспи' },
        { key: 'delivery_pickup', value: 'Доставка самовывоз', text: 'Доставка самовывоз' },
        { key: 'completed', value: 'Выдан', text: 'Выдан' },
        { key: 'canceled', value: 'Отменен', text: 'Отменен' },
        { key: 'returned', value: 'Возвращен', text: 'Возвращен' },
    ];

    useEffect(() => {
        console.log("fetchOrders")
        if (user_id) {
            fetchOrders();
        }
    }, [user_id, currentPage, debouncedSearchQuery, statusFilter]); // Add statusFilter to dependencies

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
                    user_id,
                    (currentPage - 1) * itemsPerPage,
                    itemsPerPage,
                    group_id,
                    customer_id,
                    statusFilter); // Pass status filter to API
                setOrders(prevOrders => currentPage === 1 ? fetchedOrders : [...prevOrders, ...fetchedOrders]);
            } else {
                const fetchedOrders = await apiManager.getOrderByCode(
                    user_id,
                    debouncedSearchQuery,
                    (currentPage - 1) * itemsPerPage,
                    itemsPerPage);
                setOrders(prevOrders => currentPage === 1 ? fetchedOrders : [...prevOrders, ...fetchedOrders]);
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
            renderHeaderCell: () => 'Код заказа',
            renderCell: (item) => item.code,
        }),
        createTableColumn<Order>({
            columnId: 'status',
            compare: (a, b) => a.state_status.localeCompare(b.state_status),
            renderHeaderCell: () => 'Статус',
            renderCell: (item) => item.state_status,
        }),
        createTableColumn<Order>({
            columnId: 'phone',
            compare: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
            renderHeaderCell: () => 'Телефон',
            renderCell: (item) => item.phone || 'N/A',
        }),
        createTableColumn<Order>({
            columnId: 'name',
            compare: (a, b) => (a.customer?.first_name || '').localeCompare(b.customer?.first_name || ''),
            renderHeaderCell: () => 'Имя',
            renderCell: (item) => (
                <Button
                    disabled={!item.customer}
                    onClick={() => router.push(`/client/${user_id}/customers/${item.customer?.id}`)}
                >
                    {item.customer?.first_name || "N/A"}
                </Button>
            ),
        }),
        createTableColumn<Order>({
            columnId: 'is_sended',
            compare: (a, b) => (a.is_sended === b.is_sended ? 0 : a.is_sended ? 1 : -1),
            renderHeaderCell: () => 'Отправлено?',
            renderCell: (item) => (
                <Badge
                    appearance="filled"
                    color={item.is_sended ? 'success' : 'danger'}
                >
                    {item.is_sended ? 'Yes' : 'No'}
                </Badge>
            )
        }),
        createTableColumn<Order>({
            columnId: 'has_review',
            compare: (a, b) => (!!a.review_id === !!b.review_id ? 0 : a.review_id ? 1 : -1),
            renderHeaderCell: () => 'Отзыв?',
            renderCell: (item) => (
                <Badge
                    appearance="filled"
                    color={item.review_id ? 'success' : 'danger'}
                >
                    {item.review_id ? 'Yes' : 'No'}
                </Badge>
            )
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
        })
    ];

    return (
        <>
            {loading && <Spinner />}
            {!loading && <>
                {filters &&
                    <Card style={{ marginBottom: "12px" }}>
                        <Stack horizontal wrap tokens={{ childrenGap: 16 }} style={{ marginBottom: '16px' }}>
                            <Stack tokens={{ childrenGap: 8 }}>
                                <Label htmlFor="search-input">Поиск по коду</Label>
                                <Input
                                    id="search-input"
                                    type="text"
                                    placeholder="Код заказа"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </Stack>
                            <Stack tokens={{ childrenGap: 8 }}>
                                <Label htmlFor="status-filter">Статус заказа</Label>
                                <Select
                                    id="status-filter"
                                    value={statusFilter}
                                    onChange={(e, data) => setStatusFilter(data.value)}
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.key} value={option.value}>
                                            {option.text}
                                        </option>
                                    ))}
                                </Select>
                            </Stack>
                        </Stack>
                    </Card>
                }
                <Card>
                    <div style={{ overflowX: 'auto', width: '100%' }}> {/* Mobile style container for DataGrid */}
                        <DataGrid
                            resizableColumns={true}
                            items={orders}
                            columns={columns}
                            sortable
                            style={{ minWidth: '600px' }} // Ensure minimum width for DataGrid
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
                    </div>
                    <div style={{ textAlign: 'center', paddingTop: '12px' }}>
                        <Button onClick={() => loadNextPage()}>
                            Загрузить больше
                        </Button>
                    </div>
                </Card>
            </>}
        </>

    );
};

export default OrdersDashboard;
