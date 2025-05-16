import "./App.css";

import { useState, useEffect } from "react";
import { generate } from "random-words";

import Caret from "./components/Caret";
import WordBox from "./components/WordBox";

function App() {
    const [wordsToType] = useState(
        () => generate({ exactly: 30, minLength: 2, maxLength: 25 }) as string[]
    );
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                /^[a-zA-Z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~ ]$/.test(e.key)
            ) {
                setInput((prev) => {
                    const lastSpaceIndex = prev.lastIndexOf(" ");
                    const currentWord = prev.slice(lastSpaceIndex + 1);

                    if (
                        (prev === "" && e.key === " ") ||
                        (currentWord === "" && e.key === " ")
                    ) {
                        return prev;
                    }

                    if (currentWord.length >= 25 && e.key !== " ") {
                        return prev;
                    }
                    return prev + e.key;
                });
            } else if (e.key === "Backspace") {
                setInput((prev) => prev.slice(0, -1));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const wordsTyped = input.trim().split(/\s+/).filter(Boolean);

    useEffect(() => {
        console.log(wordsTyped);
    }, [wordsTyped]);

    return (
        <div id="wordsWrapper">
            <Caret left={7} top={11} height={30} />
            <div className="words">
                {wordsToType.map((wordToType: string, key: number) => {
                    const typedWord = wordsTyped[key] || "";

                    const chars = wordToType.split("").map((char, charIdx) => {
                        let className = "";
                        if (typedWord[charIdx] === undefined) {
                            className = "";
                        } else if (typedWord[charIdx] === char) {
                            className = "correct";
                        } else {
                            className = "incorrect";
                        }
                        return (
                            <span key={charIdx} className={className}>
                                {char}
                            </span>
                        );
                    });

                    const extraChars =
                        typedWord.length > wordToType.length
                            ? typedWord
                                  .slice(wordToType.length)
                                  .split("")
                                  .map((char, idx) => (
                                      <span
                                          key={`extra-${idx}`}
                                          className="incorrect"
                                      >
                                          {char}
                                      </span>
                                  ))
                            : null;

                    return (
                        <WordBox key={key} word={wordToType}>
                            {chars}
                            {extraChars}
                        </WordBox>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
