import type { ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

function Words({ children }: Props) {
    return <div className="words">{children}</div>;
}

export default Words;
