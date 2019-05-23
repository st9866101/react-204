import React from 'react'
import $ from 'jquery'

class AjaxForm extends React.Component {
  constructor() {
    super()
    this.state = {
      method: 'GET',
      id: '',
      data: '',
      sendData: null,
      result: '',
    }
  }

  requestToServer = (url, method, data = {}) => {
    $.ajax({
      url: url,
      type: method,
      data: JSON.stringify(data),
      dataType: 'json',
      cors: true,
      contentType: 'application/json',
      // 注意：此處一定要用箭頭函式，抓取周邊的this值
      // 不然this.setState無法正常運作
      success: response => {
        this.setState({ result: response })
        console.log(response)
      },
      error: error => {
        this.setState({ result: error })
        console.log('錯誤訊息', error)
      },
    })
  }

  handleChange = event => {
    //ES6 computed property name(計算得出的屬性名稱)語法
    this.setState({ [event.target.name]: event.target.value })

    if (event.target.name === 'data') {
      let sendData = null
      try {
        sendData = JSON.parse(event.target.value)
      } catch (e) {
        console.log(e)
        sendData = null
      }
      this.setState({ sendData })
    }
  }

  handleClick = () => {
    let url = 'http://localhost:5555/items/'

    if (
      this.state.method === 'PUT' ||
      this.state.method === 'PATCH' ||
      this.state.method === 'DELETE'
    )
      url += this.state.id

    this.requestToServer(url, this.state.method, this.state.sendData)
  }

  render() {
    return (
      <>
        <div>
          <label>
            Method
            <select
              name="method"
              value={this.state.method}
              onChange={this.handleChange}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            ID(for PUT/PATCH/DELETE)
            <input
              type="text"
              name="id"
              value={this.state.id}
              onChange={this.handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Data
            <textarea
              name="data"
              value={this.state.data}
              onChange={this.handleChange}
            />
          </label>
        </div>
        <div>
          <button onClick={this.handleClick}>Send</button>
        </div>
        <div>
          <label>
            Result
            <textarea
              name="result"
              value={JSON.stringify(this.state.result)}
              onChange={this.handleChange}
            />
          </label>
        </div>
      </>
    )
  }
}

export default AjaxForm
