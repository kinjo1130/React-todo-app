import Dexie from 'dexie'
import { useEffect, useState } from 'react'
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
  //これがhooksだから、ここのtodosにindexDBのデータを入れるべき
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  // const db = new Dexie('todos');
  // db.version(1).stores({
  //   todo: 'value'
  // })
  // useEffect(() => {
  //   db.todo.toArray().then((todo) => {
  //     console.log(todo)
  //     setTodos([todo,...todos])
  //   })
  // },[])

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

  const addTodo = async () => {
    if (!text) return
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false
    }
    // ここはindexDBに追加するだけ
    // await db.todo.put({ value: newTodo.value, id: newTodo.id, checked: newTodo.checked, removed: newTodo.removed })
    setTodos([newTodo, ...todos])
    setText('')
    // await db.close()
  }
  const checkedTodo = (id: number, checked: boolean) => {
    const deepcopy = todos.map((todo) => ({ ...todo }))
    const newTodos = deepcopy.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked
        // await db.todo.put({ value: todo.value, id: todo.id, checked: todo.checked, removed: todo.removed })
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
      <h1 className="text-3xl font-bold">Todo app</h1>
      <select
        className="form-select appearance-none
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding bg-no-repeat
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
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
          className="btn"
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
          className="flex justify-center mb-10 mt-5"
        >
          <input type="text" className="
              block
              w-half
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            " value={text} onChange={handleOnChange} />
          <input type="submit" className="btn" value="追加" onSubmit={addTodo} />
        </form>
      )}
      <div className="grid justify-items-center ">
        <ul>
          {filteredTodo.map((todo) => (
            <div className="card w-fit h-24 bg-base-100 shadow-xl my-5 grid place-content-center ">
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
                  className="
                    w-8/12
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                  "
                  disabled={todo.checked}
                  value={todo.value}
                  onChange={(e) => {
                    editTodo(todo.id, e.target.value)
                  }}
                />
                <button
                  className="btn"
                  onClick={() => {
                    removeTodo(todo.id, todo.removed)
                  }}
                >
                  {todo.removed ? '復元' : '削除'}
                </button>
              </li>
            </div>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default App
