import { useState } from "react";

function FormInput() {
    const [text, setText] = useState("");
    const [text2, setText2] = useState("");

    return (
        <div>
            <h2>Form Input</h2>

            <div>
                <input
                    type="text"
                    placeholder="Enter text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <p>You entered: {text}</p>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Enter second text"
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                />

                <p>You entered second text: {text2}</p>
            </div>
        </div>
    );
}

export default FormInput;