// src/components/CustomerDashboard.tsx

'use client';

import React from 'react';

import {
    DataGrid,
    DataGridHeader,
    DataGridRow,
    DataGridHeaderCell,
    DataGridCell,
    DataGridBody,
    TableColumnDefinition,
    createTableColumn,
} from '@fluentui/react-components';

import { Customer } from '@/types/customer';
import { numberWithSpaces } from '@/utils/price'


const CustomerDashboard: React.FC<{ customers: Customer[] }> = ({ customers }) => {

    const columns: TableColumnDefinition<Customer>[] = [
        createTableColumn<Customer>({
            columnId: 'first_name',
            compare: (a, b) => a.first_name.localeCompare(b.first_name),
            renderHeaderCell: () => 'Имя',
            renderCell: (item) => item.first_name,
        }),
        createTableColumn<Customer>({
            columnId: 'last_name',
            compare: (a, b) => a.last_name.localeCompare(b.last_name),
            renderHeaderCell: () => 'Фамилия',
            renderCell: (item) => item.last_name,
        }),
        createTableColumn<Customer>({
            columnId: 'phone',
            compare: (a, b) => a.phone.localeCompare(b.phone),
            renderHeaderCell: () => 'Телефон',
            renderCell: (item) => item.phone,
        }),
        createTableColumn<Customer>({
            columnId: 'total_spent',
            compare: (a, b) => (a.total_spent ?? 0) - (b.total_spent ?? 0),
            renderHeaderCell: () => 'Потрачено',
            renderCell: (item) => numberWithSpaces(item.total_spent ?? 0),
        }),
        createTableColumn<Customer>({
            columnId: 'orders_count',
            compare: (a, b) => (a.orders_count ?? 0) - (b.orders_count ?? 0),
            renderHeaderCell: () => 'Кол-во заказов',
            renderCell: (item) => item.orders_count ?? 0,
        })

    ];

    return (
        <div>
            <DataGrid
                items={customers}
                columns={columns}
                sortable
                resizableColumns={true}
            >
                <DataGridHeader>
                    <DataGridRow>
                        {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                        )}
                    </DataGridRow>
                </DataGridHeader>
                <DataGridBody<Customer>>
                    {({ item, rowId }) => (
                        <DataGridRow<Customer>
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
    );
};

export default CustomerDashboard;