import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    key: string | number;
    status: string;
}

function Letter({ children, key, status }: Props) {
    return (
        <span key={key} className={status}>
            {children}
        </span>
    );
}

export default Letter;
