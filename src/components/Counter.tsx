interface Props {
    completedWordsCount: number;
    wordsToTypeCount: number;
}

function Counter({ completedWordsCount, wordsToTypeCount }: Props) {
    return (
        <div id="counter">
            <span>
                {completedWordsCount}/{wordsToTypeCount}
            </span>
        </div>
    );
}

export default Counter;
