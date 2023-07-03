import React, { useEffect } from 'react'
import { Auth } from './components/Auth'
import { Todo } from './components/Todo'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'

function App() {
  // マウント時に1回だけ実行する
  useEffect(() => {
    // axios に Cookie を送受信させたいときは withCredentials=true を設定する
    axios.defaults.withCredentials = true
    // getCsrfToken 関数の定義
    const getCsrfToken = async () => {
      // process.env. で .env ファイルの内容を参照する
      const { csrf_token } = await axios
        .get(`${process.env.REACT_APP_MALAMUTE_URL}/csrf`)
        .then((res) => res.data)
      // axios で API をコールする場合の Header のデフォルト値に設定する
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token
    }
    // getCsrfToken 関数の呼び出し
    getCsrfToken()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/todo' element={<Todo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
