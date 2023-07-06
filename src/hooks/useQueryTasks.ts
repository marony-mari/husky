import axios from 'axios'
import { useError } from './useError'
import { useQuery } from '@tanstack/react-query'
import { Tasks } from '../types'

export const useQueryTasks = () => {
  const { switchErrorHandling } = useError()

  const getTasks = async () => {
    const { data }: { data: Tasks } = await axios.get(
      `${process.env.REACT_APP_MALAMUTE_URL}/tasks`
    )
    return data
  }

  // フロントエンドでキャッシュを持つことができる
  // https://tanstack.com/query/v4/docs/react/reference/useQuery
  return useQuery({
    queryKey: ['tasks'], // キャッシュの key
    queryFn: getTasks,
    staleTime: Infinity, //　保管期限
    onError: (e: any) => {
      if (e.response.data.message) {
        switchErrorHandling(e.response.data.message)
      } else {
        switchErrorHandling(e.response.data)
      }
    }
  })
}
