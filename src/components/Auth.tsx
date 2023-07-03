import { CheckBadgeIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useMutateAuth } from '../hooks/useMutateAuth'

// 以下 Auth コンポーネント
export const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigninMode, setIsSigninMode] = useState(true)

  const { signInMutation, signUpMutation } = useMutateAuth()

  // イベントにカーソルを当てて表示されるイベントの型を「：」の後ろに書く
  // event は e で取得可能
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault() // 画面遷移をキャンセルするための関数（ type：sumbit には画面遷移の機能が備わっているため）
    if (isSigninMode) {
      signInMutation.mutate({ email: email, password: password })
    } else {
      await signUpMutation
        .mutateAsync({ email: email, password: password })
        .then(() => {
          signInMutation.mutate({ email: email, password: password })
        })
    }
  }

  return (
    // flex は子要素に対して適応（ gap も同様）
    <div className='flex flex-col items-center justify-center h-screen text-gray-600 font-mono gap-5'>
      <h1 className='flex items-center gap-2'>
        {/* アイコンを表示 */}
        <CheckBadgeIcon className='h-8 w-8 text-blue-500' />
        {/* タイトルを表示 */}
        <span className='text-3xl font-extrabold'>Todo List React App</span>
      </h1>
      {/* サインインモードの状態によって表示する値を変える */}
      <div>{isSigninMode ? 'Sign in' : 'Sign up'}</div>
      <form
        className='flex flex-col items-center gap-3'
        // 10行目から関数の定義をしている
        // この書き方の時は引数を渡さなくて良い
        onSubmit={handleSubmit}
      >
        <input
          type='email'
          className='border border-gray-300 py-2 px-3 text-sm'
          placeholder='email address'
          value={email} // state を value に指定する事で state の変更を検知できるようになる
          name='email'
          autoFocus // このページを開いた時にデフォルトでフォーカスが当たる
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          className='border border-gray-300 py-2 px-3 text-sm'
          placeholder='password'
          value={password}
          name='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='py-2 px-4 rounded text-white bg-indigo-600 disabled:opacity-40 hover:bg-indigo-500'
          disabled={!email || !password} // email、password どちらも入力されている時という条件になる
          type='submit'
        >
          {/* サインインモードの状態によって表示する値を変える */}
          {isSigninMode ? 'Sign in' : 'Sign up'}
        </button>
      </form>
      {/* button タグの中にアイコンタグを入れる事で、アイコンを押された時にボタン内の処理を実行 */}
      <button
        className='w-6 h-6 text-blue-500'
        onClick={() => setIsSigninMode(!isSigninMode)}
      >
        <ArrowPathIcon />
      </button>
    </div>
  )
}
