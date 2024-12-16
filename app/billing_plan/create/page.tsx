'use client';

import React, { useState } from 'react';

import Create from '@/components/Create';
import { FormContextType } from '@rjsf/utils';
import { apiManager } from '@/services';

const CreateBillingPlanPage: React.FC = () => {

    const [formData, setFormData] = useState<FormContextType>({});

    const handleCreate = async (data: FormContextType) => {
        await apiManager.createBillingPlan(data)
    }


    return (
        <Create
            title="Create billing plan"
            getSchema={async () => await apiManager.getBillingPlanSchema()}
            onCreate={handleCreate}
            setFormData={setFormData}
            formData={formData}
            redirectOnCreate='/billing_plan'
        />
    );
};

export default CreateBillingPlanPage;
