import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { FC } from 'react'
import { TaskItemProps } from '../types'
import { useMutateTask } from '../hooks/useMutateTask'
import useStore from '../store'

export const TaskItem: FC<TaskItemProps> = ({ id, title }) => {
  const updateEditedTask = useStore((state) => state.updateEditedTask)
  const { deleteTaskMutation } = useMutateTask()

  return (
    <li className='flex'>
      <div className='font-bold mr-5'>{title}</div>
      <button
        className='h-5 w-5 mr-2'
        onClick={() => updateEditedTask({ id, title })}
      >
        <PencilIcon className='text-blue-500' />
      </button>
      <button
        className='h-5 w-5'
        onClick={() => {
          deleteTaskMutation.mutate(id)
        }}
      >
        <TrashIcon className='text-blue-500' />
      </button>
    </li>
  )
}
