'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { FormContextType } from '@rjsf/utils';

import { apiManager } from '@/services'
import Create from '@/components/Create';



const CreatePeriodNotificationPage: React.FC = () => {


    const [formData, setFormData] = useState<FormContextType>({});
    const params = useParams();

    const handleCreate = async (data: FormContextType) => {
        await apiManager.createTemplatePeriodNotification(Number(params.id), data);
    }

    return (
        <Create
            title="Create period notification"
            getSchema={async () => await apiManager.getTemplateNotifiSchema()}
            onCreate={handleCreate}
            setFormData={setFormData}
            formData={formData}
            redirectOnCreate={`/client/${params.id}`}
        />
    );
};

export default CreatePeriodNotificationPage; 