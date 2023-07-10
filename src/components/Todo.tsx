import { ShieldCheckIcon } from '@heroicons/react/24/solid'
import useStore from '../store'
import { TaskItem } from './TaskItem'
import { useMutateAuth } from '../hooks/useMutateAuth'
import { useQueryClient } from '@tanstack/react-query'
import { useMutateTask } from '../hooks/useMutateTask'
import { useQueryTasks } from '../hooks/useQueryTasks'

export const Todo = () => {
  const editedTask = useStore((state) => state.editedTask)
  const updateEditedTask = useStore((state) => state.updateEditedTask)

  // hooks はコンポーネント直下で呼び出す
  const { signOutMutation } = useMutateAuth()
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQueryTasks()

  const signOut = async () => {
    await signOutMutation.mutateAsync()
    queryClient.removeQueries(['tasks'])
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (editedTask.id === 0) {
      createTaskMutation.mutate({ title: editedTask.title })
    } else {
      updateTaskMutation.mutate(editedTask)
    }
  }

  return (
    <div className='flex flex-col gap-5 items-center justify-center h-screen text-gray-600 font-mono '>
      <h1 className='flex items-center '>
        <ShieldCheckIcon className='h-8 w-8 mr-3 text-indigo-500' />
        <span className='text-3xl font-extrabold'>Task Manager</span>
        <button
          className='w-32 h-6 text-blue-500 text-xs underline'
          onClick={signOut}
        >
          ログアウト
        </button>
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          className='border border-gray-300 py-2 px-3 mr-3 text-sm'
          placeholder='タスクを入力'
          name='task'
          autoFocus // このページを開いた時にデフォルトでフォーカスが当たる
          value={editedTask.title}
          maxLength={10}
          onChange={(e) =>
            updateEditedTask({ ...editedTask, title: e.target.value })
          }
        />
        <button
          type='submit'
          className='py-2 px-4 rounded text-white bg-indigo-600 disabled:opacity-40 hover:bg-indigo-500'
          disabled={!editedTask.title}
        >
          {editedTask.id === 0 ? '登録' : '更新'}
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data?.map((task) => (
            <TaskItem id={task.id} title={task.title} />
          ))}
        </ul>
      )}
    </div>
  )
}
