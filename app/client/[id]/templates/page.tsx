'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
} from '@fluentui/react-components';
import { apiManager } from '@/services';
import { Template } from '@/types/template';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import { OpenRegular } from '@fluentui/react-icons';

const TemplatesPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // Get the client ID from the URL
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchTemplates();
        }
    }, [id]);

    const fetchTemplates = async () => {
        try {
            const fetchedTemplates = await apiManager.getTemplates(Number(id));
            setTemplates(fetchedTemplates);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns: TableColumnDefinition<Template>[] = [

        createTableColumn<Template>({
            columnId: 'status',
            compare: (a, b) => a.state_status.localeCompare(b.state_status),
            renderHeaderCell: () => 'Статус',
            renderCell: (item) => item.state_status,
        }),
        createTableColumn<Template>({
            columnId: "openAction",
            renderHeaderCell: () => {
                return "Открыть";
            },
            renderCell: (item) => {
                return <Button
                    icon={<OpenRegular />}
                    onClick={() => router.push(`/client/${params.id}/templates/${item.id}`)}
                >
                    Open
                </Button>;
            },
        }),
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BackButtonLayout title='Шаблоны'>
            <div style={{ marginBottom: '1rem' }}>
                <Button appearance="primary" onClick={() => router.push(`/client/${id}/templates/create`)}>
                    Создать шаблон
                </Button>
            </div>
            <DataGrid
                items={templates}
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
                <DataGridBody<Template>>
                    {({ item, rowId }) => (
                        <DataGridRow<Template>
                            key={rowId}
                        >
                            {({ renderCell }) => (
                                <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    )}
                </DataGridBody>
            </DataGrid>
        </BackButtonLayout>
    );
};

export default TemplatesPage;
