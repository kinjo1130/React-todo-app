import { useState } from 'react'
import './App.css'
// function App() {} これだとエラーになる.
// main.tsxの方でエラーを吐く、おそらく名前付きimportみたいな話だろうと思う

type Todo = {
  value: string
  readonly id: number
  checked: boolean
  removed: boolean
}
type Filter = 'all' | 'checked' | 'unchecked' | 'removed'

export function App() {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const editTodo = (id: number, value: string) => {
    const deepcopy = todos.map((todo) => ({ ...todo }))
    // なんで上のスプレッド構文が、({})みたいな形になっているかというと、スプレッド構文で展開しているのは、配列に入っているオブジェクトだから
    const newTodos = deepcopy.map((todo) => {
      if (todo.id === id) {
        todo.value = value
      }
      return todo
    })
    // console.log("元のデータが変更されているかどうか？")
    // todos.map((todo)=>{console.log(`id:${todo.id},value:${todo.value}`)})
    setTodos(newTodos)
  }

  const addTodo = () => {
    if (!text) return
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false
    }
    setTodos([newTodo, ...todos])
    setText('')
  }
  const checkedTodo = (id: number, checked: boolean) => {
    const deepcopy = todos.map((todo) => ({ ...todo }))
    const newTodos = deepcopy.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked
      }
      return todo
    })
    // console.log("元のデータが変更されているかどうか？")
    // todos.map((todo)=>{console.log(`id:${todo.id},value:${todo.value}`)})
    setTodos(newTodos)
  }
  const removeTodo = (id: number, removed: boolean) => {
    const deepcopy = todos.map((todo) => ({ ...todo }))
    const newTodos = deepcopy.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed
      }
      return todo
    })
    setTodos(newTodos)
  }

  const filteredTodo = todos.filter((todo) => {
    switch (filter) {
      // 全ての配列を返す
      case 'all':
        return !todo.removed
      // チェック済みで、未削除の配列を返す
      case 'checked':
        return todo.checked && !todo.removed
      // 未チェック済みで、未削除の配列を返す
      case 'unchecked':
        return !todo.checked && !todo.removed
      // 削除済みの配列を返す
      case 'removed':
        return todo.removed
      default:
        return todo
    }
  })
  const deleteTodo = () => {
    const newTodos = todos.filter((todo) => !todo.removed)
    setTodos(newTodos)
  }

  return (
    <div>
      {/* e.preventDefaultがないとページごとリロードされてしますな。それはよろしくない */}
      <h1>Todo app</h1>
      <select
        defaultValue="all"
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
      {filter === 'removed' ? (
        <button
          onClick={deleteTodo}
          // todos.filter((todo) => todo.removed)ここの配列が0だったときに、ボタンが押せないようにする.だからこのコードはダメ。todos.filter((todo) => todo.removed.length === 0)。これはremovedの中にlengthというプロパティがあるようになってしまう
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ごみ箱を空にする
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addTodo()
          }}
        >
          <input type="text" value={text} onChange={handleOnChange} />
          <input type="submit" value="追加" onSubmit={addTodo} />
        </form>
      )}
      <ul>
        {filteredTodo.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              disabled={todo.removed}
              checked={todo.checked}
              onChange={() => {
                checkedTodo(todo.id, todo.checked)
              }}
            />
            <input
              type="text"
              disabled={todo.checked || todo.checked}
              value={todo.value}
              onChange={(e) => {
                editTodo(todo.id, e.target.value)
              }}
            />
            <button
              onClick={() => {
                removeTodo(todo.id, todo.removed)
              }}
            >
              {todo.removed ? '復元' : '削除'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
