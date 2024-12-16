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
    Spinner,
    OnSelectionChangeData,
} from '@fluentui/react-components';
import {
    DeleteRegular,
    OpenRegular,
} from '@fluentui/react-icons';

import { BillingPlan } from '@/types/billing_plan'
import { apiManager } from '@/services';


const BillingPlanDashboard: React.FC = () => {
    const router = useRouter();
    const [billingPlans, setBillingPlans] = useState<BillingPlan[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        (async () => {
            await fetchBillingPlans();
            setLoading(false);
        })();
    }, []);

    const fetchBillingPlans = async () => {
        try {
            const billing_plans = await apiManager.getBillingPlans();
            setBillingPlans(billing_plans)
        } catch (error) {
            console.error('Failed to fetch billing plans:', error);
        }
    }

    const columns: TableColumnDefinition<BillingPlan>[] = [
        createTableColumn<BillingPlan>({
            columnId: 'id',
            compare: (a, b) => a.id - b.id,
            renderHeaderCell: () => 'Id',
            renderCell: (item) => item.id,
        }),
        createTableColumn<BillingPlan>({
            columnId: 'name',
            compare: (a, b) => a.name.localeCompare(b.name),
            renderHeaderCell: () => 'Name',
            renderCell: (item) => item.name,
        }),

        createTableColumn<BillingPlan>({
            columnId: "openAction",
            renderHeaderCell: () => {
                return "Open";
            },
            renderCell: (item) => {
                return <Button
                    icon={<OpenRegular />}
                    onClick={() => router.push(`/billing_plan/${item.id}`)}
                >
                    Open
                </Button>;
            },
        }),
    ];

    const handleSelectionChange = (
        e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
        data: OnSelectionChangeData
    ) => {
        setSelectedItems(data.selectedItems);
    };


    const handleRemove = async () => {
        const selectedIds = Array.from(selectedItems).map(Number);
        try {
            console.log('Removing billing plans:', selectedIds);
            for (const selectedId of selectedIds) {
                const billingPlanId = billingPlans[selectedId].id;
                await apiManager.deleteBillingPlan(billingPlanId);
                setBillingPlans(billingPlans.filter(i => i.id != billingPlanId));
            }
            setSelectedItems(new Set()); // Reset selection
        } catch (error) {
            console.error('Error removing billing plans:', error);
        }
    };

    return (
        <div>
            <div style={{
                marginBottom: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <Button appearance="primary"
                    onClick={() => router.push('/billing_plan/create')}
                >
                    Add New billing plan
                </Button>
                {selectedItems.size > 0 && (

                    <Button
                        appearance="secondary"
                        icon={<DeleteRegular />}
                        onClick={handleRemove}
                    >
                        Remove Selected
                    </Button>
                )}
            </div>
            <DataGrid
                items={billingPlans}
                columns={columns}
                sortable
                selectionMode="multiselect"
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
            >
                <DataGridHeader>
                    <DataGridRow>
                        {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                        )}
                    </DataGridRow>
                </DataGridHeader>
                {loading &&
                    <Spinner />
                }
                {!loading && <DataGridBody<BillingPlan>>
                    {({ item, rowId }) => (
                        <DataGridRow<BillingPlan>
                            key={rowId}
                            selectionCell={{
                                checkboxIndicator: { "aria-label": "Select row" },
                            }}
                        >
                            {({ renderCell }) => (
                                <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    )}
                </DataGridBody>}
            </DataGrid>
        </div>
    );
};

export default BillingPlanDashboard;