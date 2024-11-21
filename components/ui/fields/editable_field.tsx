import React, { useState } from 'react';

import {
    Text,
    Input,
    Checkbox,
    Textarea
} from '@fluentui/react-components';

const SwitchableInput: React.FC<{
    initialValue: string | boolean | number,
    onChange: (name: string, value: string | boolean | number) => void,
    name: string,
    isEditing: boolean,
    isBoolean?: boolean,
    isTextarea?: boolean,
    inputType?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'number' | 'time' | 'week';
}> = ({ initialValue, onChange, name, isEditing, isBoolean, isTextarea, inputType = 'text', }) => {
    const [value, setValue] = useState(initialValue);

    const handleChnage = (value: any) => {
        setValue(value)
        onChange(name, value)
    }
    return (
        <div>
            {isEditing ? (
                isBoolean ? (
                    <Checkbox
                        checked={value as boolean}
                        onChange={(e) => handleChnage(e.target.checked)}
                    />
                ) : isTextarea ? (
                    <Textarea
                        style={{ 'width': '100%' }}
                        resize='vertical'
                        size='large'
                        value={value as string}
                        name={name}
                        onChange={(e) => handleChnage(e.target.value)}
                    />
                ) : (
                    <Input
                        type={inputType}
                        value={value as string}
                        name={name}
                        onChange={(e) => handleChnage(e.target.value)}
                    />
                )
            ) : (
                <Text>{!isTextarea ? value.toString() : value.toString().split('\n').map((str, id) => <p key={id}>{str}</p>) || 'No set'}</Text>
            )}
        </div>
    );
};

export default SwitchableInput;