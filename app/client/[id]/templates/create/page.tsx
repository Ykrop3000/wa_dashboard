'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

import { apiManager } from '@/services';
import Create from '@/components/Create';
import { FormContextType } from '@rjsf/utils';

const CreateTemplatePage: React.FC = () => {

    const [formData, setFormData] = useState<FormContextType>({});
    const params = useParams();

    const handleCreate = async (data: FormContextType) => {
        await apiManager.createTemplate(Number(params.id), data);
    }

    return (
        <Create
            title="Создать шаблон"
            getSchema={async () => await apiManager.getTemplateSchema()}
            onCreate={handleCreate}
            setFormData={setFormData}
            formData={formData}
            redirectOnCreate={`/client/${params.id}/templates`}
        />
    );
};

export default CreateTemplatePage;
