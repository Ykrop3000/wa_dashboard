import { useRouter } from 'next/navigation';

import { Button, Menu, MenuItem, MenuPopover, MenuList, MenuTrigger } from "@fluentui/react-components";
import { Navigation20Regular } from "@fluentui/react-icons"

const MenuNavigation = () => {
    const router = useRouter();
    return (
        <Menu positioning={{ autoSize: true }}>
            <MenuTrigger >
                <Button icon={<Navigation20Regular />} />
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={() => router.push('/client')}>Клиенты</MenuItem>
                    <MenuItem onClick={() => router.push('/billing_plan')}>Billing plans</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>

    );
};
export default MenuNavigation;
