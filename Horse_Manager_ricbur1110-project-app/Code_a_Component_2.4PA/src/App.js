// Richard Burns 
// Date: 2024-06-10
// Description: This is the main App component that renders a button and displays the count of clicks.

import { useState } from "react";
import Button from "./Button";

// The App component manages the state of the button click count and passes it down to the Button component as props.
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("Button clicked!");
    setCount(count + 1);
  };

  // The App component renders the Button component and passes the current count and the click handler as props.
  return (
    <div>
      <h1>React Button Component</h1>
      <Button
        count={count}
        onButtonClick={handleClick}
      />
    </div>
  );
}

export default App;
