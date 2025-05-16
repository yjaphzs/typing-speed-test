interface Props {
    left: number;
    top: number;
    height?: number;
}

const Caret = ({ left, top, height = 24 }: Props) => {
    return (
        <div
            id="caret"
            style={{
                left: `${left}px`,
                top: `${top}px`,
                height: `${height}px`,
            }}
        />
    );
};

export default Caret;
