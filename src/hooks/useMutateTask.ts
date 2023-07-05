import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useError } from './useError'
import { Task, Tasks } from '../types'
import axios from 'axios'
import useStore from '../store'

export const useMutateTask = () => {
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const queryClient = useQueryClient()
  const { switchErrorHandling } = useError()

  const createTaskMutation = useMutation(
    (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
      return axios.post<Task>(
        `${process.env.REACT_APP_MALAMUTE_URL}/tasks`,
        task
      )
    },
    {
      onSuccess: (res) => {
        const currentTasks = queryClient.getQueryData<Tasks>(['tasks'])
        // cache の存在をチェックして、存在している場合タスクを追加
        if (currentTasks) {
          queryClient.setQueryData(['tasks'], [...currentTasks, res.data])
        }
        resetEditedTask()
      },
      onError: (e: any) => {
        if (e.response.data.message) {
          // CSRF トークンのエラー
          switchErrorHandling(e.response.data.message)
        } else {
          // CSRF トークンの以外のエラー
          switchErrorHandling(e.response.data)
        }
      }
    }
  )

  const updateTaskMutation = useMutation(
    (task: Omit<Task, 'created_at' | 'updated_at'>) => {
      return axios.put<Task>(
        `${process.env.REACT_APP_MALAMUTE_URL}/tasks/${task.id}`,
        task
      )
    },
    {
      onSuccess: (res) => {
        const currentTasks = queryClient.getQueryData<Tasks>(['tasks'])
        if (currentTasks) {
          queryClient.setQueryData(
            ['tasks'],
            currentTasks.map((currentTask) =>
              currentTask.id === res.data.id ? res.data : currentTask
            )
          )
        }
        resetEditedTask()
      },
      onError: (e: any) => {
        if (e.response.data.message) {
          // CSRF トークンのエラー
          switchErrorHandling(e.response.data.message)
        } else {
          // CSRF トークンの以外のエラー
          switchErrorHandling(e.response.data)
        }
      }
    }
  )

  const deleteTaskMutation = useMutation(
    (id: number) => {
      return axios.delete(`${process.env.REACT_APP_MALAMUTE_URL}/tasks/${id}`)
    },
    {
      onSuccess: (_, variables) => {
        const currentTasks = queryClient.getQueryData<Tasks>(['tasks'])
        if (currentTasks) {
          queryClient.setQueryData(
            ['tasks'],
            currentTasks.filter((currentTask) => currentTask.id !== variables)
          )
        }
      },
      onError: (e: any) => {
        if (e.response.data.message) {
          // CSRF トークンのエラー
          switchErrorHandling(e.response.data.message)
        } else {
          // CSRF トークンの以外のエラー
          switchErrorHandling(e.response.data)
        }
      }
    }
  )

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}
