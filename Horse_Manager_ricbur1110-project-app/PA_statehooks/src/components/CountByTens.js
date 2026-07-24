import { useState } from "react";

function CountByTens() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 10);
    };

    const decrement = () => {
        if (count > 0) {
            setCount(count - 10);
        }
    };

    return (
        <div>
            <h2>Count by Tens</h2>

            <p>Count: {count}</p>

            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    );
}

export default CountByTens;