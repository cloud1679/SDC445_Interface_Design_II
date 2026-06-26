// Richard Burns
// Date: 2024-06-10
// Description: This is the Button component that displays a button and shows the click count.

function Button({ count, onButtonClick }) {
    return (
        <div>
            <button onClick={onButtonClick}>
                Click Me
            </button>

            <p>Button clicked {count} times.</p>
        </div>
    );
}

export default Button;