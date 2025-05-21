import type { ReactNode } from "react";
import React, { forwardRef } from "react";

interface Props {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const Word = forwardRef<HTMLDivElement, Props>(
    ({ children, className, style }, ref) => {
        return (
            <div
                ref={ref}
                className={className ?? "word"}
                style={{ display: "inline-block", ...style }}
            >
                {children}
            </div>
        );
    }
);

export default Word;
