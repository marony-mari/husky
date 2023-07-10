import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useMutateAuth } from '../hooks/useMutateAuth'

export const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigninMode, setIsSigninMode] = useState(true)

  const { signInMutation, signUpMutation } = useMutateAuth()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault() // 画面遷移をキャンセルするための関数
    if (isSigninMode) {
      signInMutation.mutate({ email: email, password: password })
    } else {
      await signUpMutation
        .mutateAsync({ email: email, password: password })
        .then(() => signInMutation.mutate({ email: email, password: password }))
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen text-gray-600 font-mono gap-5'>
      <h1 className='flex items-center gap-2'>
        <CheckBadgeIcon className='h-8 w-8 text-blue-500' />
        <span className='text-3xl font-extrabold'>Todo List React App</span>
      </h1>
      <div className='text-xl'>
        {isSigninMode ? 'ログイン' : 'アカウント作成'}
      </div>
      <form
        className='flex flex-col items-center gap-3'
        onSubmit={handleSubmit}
      >
        <input
          type='email'
          className='border border-gray-300 py-2 px-3 text-sm'
          placeholder='メールアドレス'
          value={email}
          name='email'
          autoFocus // このページを開いた時にデフォルトでフォーカスが当たる
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          className='border border-gray-300 py-2 px-3 text-sm'
          placeholder='パスワード'
          minLength={6}
          maxLength={30}
          value={password}
          name='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='py-2 px-4 rounded text-white bg-indigo-600 disabled:opacity-40 hover:bg-indigo-500'
          disabled={!email || !password}
          type='submit'
        >
          {isSigninMode ? 'ログイン' : '新規登録'}
        </button>
      </form>
      <button
        className='w-80 h-6 text-blue-500 text-xs underline'
        onClick={() => setIsSigninMode(!isSigninMode)}
      >
        {isSigninMode
          ? 'まだアカウントをお持ちでない方はこちら'
          : 'ログイン画面はこちら'}
      </button>
    </div>
  )
}
