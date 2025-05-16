import type { ReactNode } from "react";

interface Props {
    word: string;
    children?: ReactNode;
}

function WordBox({ word, children }: Props) {
    return <div className="word">{children}</div>;
}

export default WordBox;
