import { useState } from 'react';
import './App.css';
//function App() {} これだとエラーになる.
//main.tsxの方でエラーを吐く、おそらく名前付きimportみたいな話だろうと思う

type Todo = {
  value: string;
  readonly id: number;
}
export const App = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const addTodo = () => {
    if (!text) return
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime()
    }
    setTodos([newTodo, ...todos]);
    setText('');
  }

  return (
    <div>
      {/* e.preventDefaultがないとページごとリロードされてしますな。それはよろしくない */}
      <h1>Todo App</h1>
      <form onSubmit={(e) => { e.preventDefault(); addTodo() }}>
        <input type="text" value={text} onChange={handleOnChange} />
        <input
          type="submit"
          value="追加"
          onSubmit={addTodo}
        />
      </form>
      <ul>{
        todos.map((todo) => { return <li key={todo.id}>{todo.value}</li> })
      }</ul>
    </div >
  )
}

export default App
