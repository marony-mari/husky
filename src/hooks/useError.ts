import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'

export const useError = () => {
  const navigate = useNavigate()
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const getCsrfToken = async () => {
    // res の値をイメージしながら書く
    //　{} で宣言したらオブジェクトで返却する
    const { csrf_token } = await axios
      .get(`${process.env.REACT_APP_MALAMUTE_URL}/csrf`)
      .then((res) => res.data)
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token
  }

  const switchErrorHandling = (msg: string) => {
    switch (msg) {
      //　値が不正
      case 'invalid csrf token':
        getCsrfToken()
        //　CSRFトークンを取得し直したからうまくいくかも
        alert('CSRF token is invalid, please try again')
        break
      //　jwt・・・アクセストークン
      //　期限切れ
      case 'invalid or expired jwt':
        //　もう一度ログインし直して
        alert('access token expired, please login')
        resetEditedTask()
        navigate('/')
        break
      //　アクセストークンが見つからない
      case 'missing or malformed jwt':
        alert('access token is not valid, please login')
        resetEditedTask()
        navigate('/')
        break
      //　重複している
      case 'duplicated key not allowed':
        alert('email already exist, please use another one')
        break
      //　パスワードがダメ
      case 'crypto/bcrypt: hashedPassword is not the hash of the given password':
        alert('password is not correct')
        break
      //　email のレコードが無い
      case 'record not found':
        alert('email is not correct')
        break
      default:
        alert(msg)
    }
  }
  return { switchErrorHandling }
}
