import React from 'react'

const TodoItem = props => {
  return (
    <li>
      {props.text}
      <button onClick={props.editMethod}>編輯</button>
      <button onClick={props.deleteMethod}>刪除</button>
    </li>
  )
}

export default TodoItem
