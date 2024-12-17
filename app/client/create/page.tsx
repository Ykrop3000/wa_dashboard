'use client';

import React, { useState } from 'react';

import { apiManager } from '@/services'
import { FormContextType } from '@rjsf/utils';

import Create from '@/components/Create';


const CreateClientPage: React.FC = () => {

    const [formData, setFormData] = useState<FormContextType>({});

    const handleCreate = async (data: FormContextType) => {
        await apiManager.createUser(data)
    }


    return (
        <Create
            title="Создать клиента"
            getSchema={async () => await apiManager.getUserSchema()}
            onCreate={handleCreate}
            setFormData={setFormData}
            formData={formData}
            redirectOnCreate='/client'
        />
    );
};

export default CreateClientPage; 