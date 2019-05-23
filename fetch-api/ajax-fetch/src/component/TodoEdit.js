import React from 'react'

class TodoEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputText: this.props.text,
    }
  }

  // 處理文字框輸入對應state變動
  handleChange = event => {
    this.setState({
      inputText: event.target.value,
    })
  }

  render() {
    return (
      <li>
        <input
          name="name"
          type="text"
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          value={this.state.inputText}
        />
        <button onClick={this.props.saveMethod(this.state.inputText)}>
          儲存
        </button>
      </li>
    )
  }
}

export default TodoEdit
