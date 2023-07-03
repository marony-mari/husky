import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useError } from './useError'
import useStore from '../store'
import { Credential } from '../types'

// Mutate ・・・データを更新すること
export const useMutateAuth = () => {
  const navigate = useNavigate()
  const { switchErrorHandling } = useError()
  const resetEditedTask = useStore((state) => state.resetEditedTask)

  const signInMutation = useMutation(
    async (user: Credential) => {
      await axios.post(`${process.env.REACT_APP_MALAMUTE_URL}/login`, user)
    },
    {
      onSuccess: () => {
        navigate('/todo')
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

  const signUpMutation = useMutation(
    async (user: Credential) => {
      await axios.post(`${process.env.REACT_APP_MALAMUTE_URL}/signup`, user)
    },
    {
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

  const signOutMutation = useMutation(
    async () => {
      await axios.post(`${process.env.REACT_APP_MALAMUTE_URL}/logout`)
    },
    {
      onSuccess: () => {
        resetEditedTask()
        navigate('/')
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

  // key と value が等しい時はわざわざ全部書かなくて良い
  return { signInMutation, signUpMutation, signOutMutation }
}
