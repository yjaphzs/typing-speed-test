import type { ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

function Word({ children }: Props) {
    return <div className="word">{children}</div>;
}

export default Word;
