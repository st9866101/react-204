import React from 'react'
import TodoItem from './TodoItem'
import TodoEdit from './TodoEdit'

class TodoAppWithFetch extends React.Component {
  constructor() {
    super()
    // todo = {id: number, text: string, completed: boolean, editing: boolean}
    this.state = {
      todos: [],
      inputText: '',
      error: null,
    }
  }

  // 載入資料的生命周期方法
  componentDidMount() {
    const url = 'http://localhost:5555/items?_sort=id&_order=desc'

    this.requestToServer(url, 'GET')
  }

  // 新增一筆資料到伺服器
  addNewItemToServer = data => {
    const url = 'http://localhost:5555/items/'

    this.requestToServer(url, 'POST', data)
  }

  // 刪除一筆資料到伺服器
  deleteItemToServer = id => {
    const url = 'http://localhost:5555/items/' + id

    this.requestToServer(url, 'DELETE')
  }

  // 更新一筆資料到伺服器
  saveItemToServer = (id, data) => {
    const url = 'http://localhost:5555/items/' + id

    this.requestToServer(url, 'PUT', data)
  }

  requestToServer = (url, method, data = {}) => {
    // GET方法不有body，先設定出樣版物件
    const requestTemplate = new Request(url, {
      method: method,
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })

    let req = requestTemplate

    // 如果不是GET再加上body
    if (method !== 'GET')
      req = new Request(requestTemplate, { body: JSON.stringify(data) })

    fetch(req)
      .then(response => {
        // 直接轉換JSON格式為物件、字串、數字…
        return response.json()
      })
      .then(jsonObject => {
        // jsonObject會是一個JavaScript物件
        if (method === 'GET')
          this.setState({
            todos: jsonObject,
          })
        console.log(jsonObject)
      })
      .catch(error => {
        // Error
        this.setState({ result: error })
        console.log('錯誤訊息', error)
      })
  }

  // 處理文字框輸入對應state變動
  handleChange = event => {
    this.setState({
      inputText: event.target.value,
    })
  }

  // 處理文字框按下Enter時
  handleKeyPress = event => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      const newTodo = {
        id: +new Date(),
        text: event.target.value,
        completed: false,
        editing: false,
      }
      const newTodos = [newTodo, ...this.state.todos]

      // 按下enter後，加到列表項目中並清空輸入框
      // 確保state已經變動，再將資料送到伺服器中新增
      // 使用setState的第二個傳入參數
      this.setState({ todos: newTodos, inputText: '' }, () =>
        this.addNewItemToServer(newTodo)
      )
    }
  }
  // 處理編輯完成後，按下儲存按鈕
  handleTodoSave = id => text => () => {
    const newTodos = this.state.todos.map(todo => {
      if (todo.id === id) {
        todo.editing = false
        todo.text = text
      }
      return todo
    })

    const data = { text: text, completed: false, editing: false }

    this.setState(
      {
        todos: newTodos,
      },
      () => this.saveItemToServer(id, data)
    )
  }

  // 處理編輯按鈕按下後，更動該物件值中的其一個屬性isEditing
  handleTodoEdit = id => () => {
    const newTodos = this.state.todos.map(todo => {
      if (todo.id === id) {
        todo.editing = true
      }
      return todo
    })

    this.setState({
      todos: newTodos,
    })
  }

  // 處理按下刪除按鈕
  handleTodoDelete = id => () => {
    const newTodos = this.state.todos.filter(todo => todo.id !== id)

    // 確保state已經變動，再將資料刪除
    // 使用setState的第二個傳入參數
    this.setState(
      {
        todos: newTodos,
      },
      () => this.deleteItemToServer(id)
    )
  }

  render() {
    // 解構賦值
    const { todos } = this.state

    return (
      <>
        <div>
          <label>
            待辦事項(輸入完成按下enter鍵):
            <input
              name="name"
              type="text"
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.inputText}
            />
          </label>
        </div>
        <ul>
          {todos.map(todo =>
            todo.editing ? (
              <TodoEdit
                key={todo.id}
                text={todo.text}
                saveMethod={this.handleTodoSave(todo.id)}
              />
            ) : (
              <TodoItem
                key={todo.id}
                text={todo.text}
                editMethod={this.handleTodoEdit(todo.id)}
                deleteMethod={this.handleTodoDelete(todo.id)}
              />
            )
          )}
        </ul>
      </>
    )
  }
}

export default TodoAppWithFetch
