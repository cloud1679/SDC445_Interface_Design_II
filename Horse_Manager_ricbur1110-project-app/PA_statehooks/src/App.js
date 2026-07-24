import Counter from "./components/Counter";
import CountByTens from "./components/CountByTens";
import FormInput from "./components/FormInput";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div>
      <h1>State and Hooks Assessment</h1>

      <Counter />
      <hr />

      <CountByTens />
      <hr />

      <FormInput />
      <hr />

      <TodoList />
    </div>
  );
}

export default App;