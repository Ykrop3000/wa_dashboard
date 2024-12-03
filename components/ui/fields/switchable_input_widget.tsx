import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import SwitchableInput from '../fields/editable_field';

const SwitchableInputWidget: React.FC<WidgetProps> = (props) => {
    const { value, onChange, schema, name } = props;
    console.log(props)
    const handleChange = (newValue: string | boolean | number | null) => {
        onChange(newValue);
    };

    return (
        <SwitchableInput
            initialValue={value || ''}
            onChange={handleChange}
            name={name}
            isEditing={props.formContext.isEditing} // Assuming you have a way to determine if editing
            isBoolean={schema.type === 'boolean'}
            isTextarea={schema.type === 'string' && schema.format === 'textarea'}
            inputType={schema.format === 'email' ? 'email' : 'text'} // Adjust input type based on schema
        />
    );
};

export default SwitchableInputWidget;