import { useState } from "react";

function FormInput() {
    const [text, setText] = useState("");

    return (
        <div>
            <h2>Form Input</h2>

            <input
                type="text"
                placeholder="Enter text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <p>You entered: {text}</p>
        </div>
    );
}

export default FormInput;