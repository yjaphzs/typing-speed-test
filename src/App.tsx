import "./App.css";

import { useState, useEffect } from "react";
import { generate } from "random-words";

import Caret from "./components/Caret";
import Words from "./components/Words";
import Word from "./components/Word";
import Letter from "./components/Letter";

function App() {
    const [wordsToType] = useState(
        () => generate({ exactly: 30, minLength: 2, maxLength: 25 }) as string[]
    );
    const [caretPos, setCaretPos] = useState<{ word: number; char: number }>({
        word: 0,
        char: 0,
    });
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        const allowedChars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=[]{};:'\",.<>/?\\|`~ ";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (allowedChars.includes(e.key)) {
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
            <Words>
                {wordsToType.map((wordToType: string, key: number) => {
                    const typedWord = wordsTyped[key] || "";

                    // get all actual typed letters (correct and incorrect)
                    const letters = wordToType
                        .split("")
                        .map((letter, index) => {
                            let status = "not-typed";
                            if (typedWord[index] === undefined) {
                                status = "";
                            } else if (typedWord[index] === letter) {
                                status = "correct";
                            } else {
                                status = "incorrect";
                            }
                            return (
                                // render letters with their status
                                <Letter key={index} status={status}>
                                    {letter}
                                </Letter>
                            );
                        });

                    // get all extra letters (typed but not in the word to type)
                    const extraLetters =
                        typedWord.length > wordToType.length
                            ? typedWord
                                  .slice(wordToType.length)
                                  .split("")
                                  .map((letter, index) => (
                                      // render extra letters with incorrect status
                                      <Letter
                                          key={`extra-${index}`}
                                          status="incorrect"
                                      >
                                          {letter}
                                      </Letter>
                                  ))
                            : null;

                    // render the word box with letters and extra letters
                    return (
                        <Word key={key}>
                            {letters}
                            {extraLetters}
                        </Word>
                    );
                })}
            </Words>
        </div>
    );
}

export default App;
