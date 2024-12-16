'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { FormContextType } from '@rjsf/utils';

import { apiManager } from '@/services';
import Detail from '@/components/Detail'

export default function TemplateDetail() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState<FormContextType>({});


    const handleUpdate = async (data: FormContextType) => {
        await apiManager.updateTemplate(Number(params.template_id), data);
    }
    const handleRemove = async () => {
        try {
            await apiManager.deleteTemplate(Number(params.template_id));
            router.push(`/client/${params.id}/templates`)
        } catch (error) {
            console.error('Error remove template:', error);
        }

    }

    return (
        <Detail
            title='Template detail'
            getSchema={async () => await apiManager.getTemplateSchema()}
            getFormData={async () => await apiManager.getTemplate(Number(params.template_id))}
            setFormData={setFormData}
            handleRemove={handleRemove}
            handleUpdate={handleUpdate}
            formData={formData}
        />
    );
} 