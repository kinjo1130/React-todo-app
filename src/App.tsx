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

  const editTodo = (id: number, value: string) => {
    const deepcopy = todos.map((todo) => ({ ...todo }))
    // なんで上のスプレッド構文が、({})みたいな形になっているかというと、スプレッド構文で展開しているのは、配列に入っているオブジェクトだから
    const newTodos = deepcopy.map((todo) => {
      if (todo.id === id) {
        todo.value = value
      }
      return todo;
    })
    console.log("古いデータ")
    todos.map((todo)=>{console.log(`id:${todo.id},value:${todo.value}`)})
    setTodos(newTodos);
  }

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
      <h1>Todo app</h1>
      <form onSubmit={(e) => { e.preventDefault(); addTodo() }}>
        <input type="text" value={text} onChange={handleOnChange} />
        <input
          type="submit"
          value="追加"
          onSubmit={addTodo}
        />
      </form>
      <ul>{
        todos.map((todo) => { return <li key={todo.id}><input type='text' value={todo.value} onChange={(e) => { editTodo(todo.id,e.target.value) }}></input></li> })
      }</ul>
    </div >
  )
}

export default App
