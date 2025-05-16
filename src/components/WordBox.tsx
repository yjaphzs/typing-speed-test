import type { ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

function WordBox({ children }: Props) {
    return <div className="word">{children}</div>;
}

export default WordBox;
