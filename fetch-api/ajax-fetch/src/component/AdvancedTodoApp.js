import React from 'react'
import TodoItem from './TodoItem'
import TodoEdit from './TodoEdit'

class AdvancedTodoApp extends React.Component {
  constructor() {
    super()
    // 單一個todo = {id:xxx, text:'xxx', isEditing: false}
    this.state = {
      todos: [],
      inputText: '',
    }
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
        isEditing: false,
      }
      const newTodos = [newTodo, ...this.state.todos]

      //按下enter後，加到列表項目中並清空輸入框
      this.setState({
        todos: newTodos,
        inputText: '',
      })
    }
  }

  // 處理編輯按鈕按下後，更動該物件值中的其一個屬性isEditing
  handleTodoEdit = id => () => {
    const newTodos = this.state.todos.map(todo => {
      if (todo.id === id) {
        todo.isEditing = true
      }
      return todo
    })

    this.setState({
      todos: newTodos,
    })
  }

  // 處理編輯完成後，按下儲存按鈕
  handleTodoSave = id => text => () => {
    const newTodos = this.state.todos.map(todo => {
      if (todo.id === id) {
        todo.isEditing = false
        todo.text = text
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

    this.setState({
      todos: newTodos,
    })
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
            todo.isEditing ? (
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

export default AdvancedTodoApp
