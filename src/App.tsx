import "./App.css";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { generate } from "random-words";

import Caret from "./components/Caret";
import Counter from "./components/Counter";
import Words from "./components/Words";
import Word from "./components/Word";
import Letter from "./components/Letter";

function App() {
    const [wordsToType] = useState(
        () => generate({ exactly: 50, minLength: 2, maxLength: 25 }) as string[]
    );
    const [input, setInput] = useState<string>("");
    const [completedWordsCount, setCompletedWordsCount] = useState<number>(0);
    const wordsTyped = input.trim().split(/\s+/).filter(Boolean);

    // --- Caret Position Calculation ---
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [caretPos, setCaretPos] = useState({ left: 7, top: 55 });

    const LETTER_WIDTH = 20;

    // Determine caret's word and character index
    const isAtWordBoundary = input.endsWith(" ");
    const caretWordIndex = isAtWordBoundary
        ? wordsTyped.length
        : wordsTyped.length - 1;
    const caretCharIndex = isAtWordBoundary
        ? 0
        : wordsTyped[caretWordIndex]?.length ?? 0;

    // Update caret position when word/char index changes or window resizes
    useLayoutEffect(() => {
        function updateCaret() {
            const wordEl = wordRefs.current[caretWordIndex];
            if (wordEl) {
                const rect = wordEl.getBoundingClientRect();
                const parentRect =
                    wordEl.parentElement?.getBoundingClientRect();
                const newLeft =
                    rect.left -
                    (parentRect?.left ?? 0) +
                    caretCharIndex * LETTER_WIDTH;
                const newTop = rect.top - (parentRect?.top ?? 0) + 45;

                // Only update if changed to avoid infinite loop
                setCaretPos((pos) => {
                    if (pos.left !== newLeft || pos.top !== newTop) {
                        return { left: newLeft, top: newTop };
                    }
                    return pos;
                });
            } else {
                setCaretPos((pos) => {
                    if (pos.left !== 7 || pos.top !== 55) {
                        return { left: 7, top: 55 };
                    }
                    return pos;
                });
            }
        }
        updateCaret();
        window.addEventListener("resize", updateCaret);
        return () => window.removeEventListener("resize", updateCaret);
        // Only depend on caretWordIndex and caretCharIndex
    }, [caretWordIndex, caretCharIndex]);

    useEffect(() => {
        const allowedChars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=[]{};:'\",.<>/?\\|`~ ";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (allowedChars.includes(e.key)) {
                setInput((prev) => {
                    const lastSpaceIndex = prev.lastIndexOf(" ");
                    const currentWord = prev.slice(lastSpaceIndex + 1);
                    const newWordsTyped = prev.trim().split(/\s+/);

                    // Set word count if the user is typing a word with Space
                    if (e.key === " " && newWordsTyped.length > 0) {
                        setCompletedWordsCount(newWordsTyped.length);
                    }

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
                setInput((prev) => {
                    // Create an array of words typed so far, different to `wordsTyped`
                    const newWordsTyped = prev.trim().split(/\s+/);

                    // Set word count if the user is deleting a word with Backspace
                    if (e.key === "Backspace") {
                        if (newWordsTyped.length > 0 && prev.length > 0) {
                            setCompletedWordsCount(newWordsTyped.length);
                            console.log(newWordsTyped);
                        } else {
                            setCompletedWordsCount(0);
                        }
                    }

                    // The current word index is the number of words minus 1 (since array is 0-based)
                    let currentWordIndex = newWordsTyped.length - 1;

                    // If the last character is a space, the user is at the next word
                    if (prev.endsWith(" ")) {
                        if (
                            newWordsTyped[currentWordIndex] ===
                            wordsToType[currentWordIndex]
                        ) {
                            return prev;
                        }
                    }

                    return prev.slice(0, -1);
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div id="typingTest">
            {/* Render the counter with the number of completed words and total words */}
            <Counter
                completedWordsCount={completedWordsCount}
                wordsToTypeCount={wordsToType.length}
            />

            {/* Caret position updates as you type and as words wrap */}
            <Caret left={caretPos.left} top={caretPos.top} height={30} />

            {/* // Render the words to type */}
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
                        <Word
                            key={key}
                            ref={(el) => {
                                wordRefs.current[key] = el;
                            }}
                        >
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
