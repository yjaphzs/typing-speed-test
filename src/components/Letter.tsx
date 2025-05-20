import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    status: string;
}

function Letter({ children, status }: Props) {
    return <span className={status}>{children}</span>;
}

export default Letter;
