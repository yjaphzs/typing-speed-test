import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    status: string;
}

function Letter({ children, status }: Props) {
    return (
        <span
            className={status}
            style={{
                display: "inline-block",
                width: "20px",
                textAlign: "center",
            }}
        >
            {children}
        </span>
    );
}

export default Letter;
