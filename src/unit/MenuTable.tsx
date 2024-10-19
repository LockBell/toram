import React, {ReactNode, ReactElement, TdHTMLAttributes} from "react";

type ChildrenProps<P = unknown> = P & {
    children: ReactNode;
}

type ItemChildren = {
    id: string;
    label: string;
    nameField?: TdHTMLAttributes<HTMLTableCellElement>;
    valueField?: TdHTMLAttributes<HTMLTableCellElement>;
    children: ReactElement<{ id: string }>;
}

export const MenuItems = ({ id, label, nameField, valueField, children }: ItemChildren) => {
    return (
        <tr>
            <td {...nameField}>
                <label htmlFor={id}>{label}</label>
            </td>
            <td {...valueField}>
                {React.cloneElement(children, { id })}
            </td>
        </tr>
    );
}

export const MenuTable = ({ children }: ChildrenProps) =>  {
    return (
        <table>
            <tbody>
            {children}
            </tbody>
        </table>
    );
}