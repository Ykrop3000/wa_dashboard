'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { FormContextType } from '@rjsf/utils';

import { apiManager } from '@/services';
import Detail from '@/components/Detail'
import { ToolbarButton } from '@fluentui/react-components';

export default function OrdersGroupDetail() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState<FormContextType>({});


    const handleUpdate = async (data: FormContextType) => {
        console.log(data)
        // await apiManager.updateTemplate(Number(params.template_id), data);
    }
    const handleRemove = async () => {
        try {
            await apiManager.deleteOrdersGroup(Number(params.orders_group_id));
            router.push(`/client/${params.id}/orders_groups`)
        } catch (error) {
            console.error('Error remove orders group:', error);
        }

    }

    return (
        <Detail
            title='Группа заказов'
            getSchema={async () => await apiManager.getOrdersGroupSchema()}
            getFormData={async () => await apiManager.getOrdersGroup(Number(params.orders_group_id))}
            setFormData={setFormData}
            handleRemove={handleRemove}
            handleUpdate={handleUpdate}
            formData={formData}
            toolbar={
                <ToolbarButton
                    aria-label="Send"
                    appearance="primary"
                    onClick={async () => await apiManager.sendOrdersGroup(Number(params.orders_group_id))}
                >
                    Отправить заказы
                </ToolbarButton>
            }
        />
    );
} 