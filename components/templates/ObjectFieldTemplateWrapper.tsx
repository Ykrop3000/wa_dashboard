import React from 'react';
import { ObjectFieldTemplateProps, RJSFSchema } from '@rjsf/utils'; // Importing the type for props
import { Card, CardHeader, makeStyles, Text } from '@fluentui/react-components'; // Importing UI components
import { getDefaultRegistry } from '@rjsf/core';

const registry = getDefaultRegistry();
const ObjectFieldTemplate = registry.templates.ObjectFieldTemplate;


const useStyles = makeStyles({

    section: {
        marginTop: '20px',
        padding: '16px',
    },
    field: {
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: '16px',
        marginBottom: '8px',
    },
    label: {
        fontWeight: 'bold',
    },
});

interface SchemaProperty {
    group?: string;
    title: string;
    type: string;
    default?: string | number | boolean;
}


const getPropsForGroup = (
    group: string[],
    props: ObjectFieldTemplateProps
): ObjectFieldTemplateProps => {
    return {
        ...props,
        properties: props.properties.filter((p) => group.includes(p.name))
    };
};

// Define the type for groupMap
interface GroupMap {
    [key: string]: string[]; // Keys are strings, values are arrays of strings
}

function transformSchemaToGroupMap(schema: RJSFSchema) {
    const groupMap: GroupMap = {};
    if (!schema.properties) {
        return groupMap
    }
    // Iterate through the properties in the schema
    Object.entries(schema.properties).forEach(([key, value]) => {
        const group = (value as SchemaProperty).group || ''; // Use type assertion

        // Initialize the group if it doesn't exist
        if (!groupMap[group]) {
            groupMap[group] = [];
        }

        // Add the field name to the corresponding group
        groupMap[group].push(key);
    });

    return groupMap;
}

const ObjectFieldTemplateWrapper = (props: ObjectFieldTemplateProps) => {
    // const registry = getDefaultRegistry();
    const { schema } = props;
    const groups = transformSchemaToGroupMap(schema);
    const styles = useStyles();

    return (
        <>
            {Object.keys(groups).map((group_name) => {
                const childProps = getPropsForGroup(groups[group_name], props);
                return (
                    <Card className={styles.section} key={group_name}>
                        <CardHeader header={<Text size={400} weight='semibold'>{group_name}</Text>} />
                        <ObjectFieldTemplate
                            {...childProps}
                            key={group_name}
                        />
                    </Card>
                );
            })}
        </>
    );
};

export default ObjectFieldTemplateWrapper;