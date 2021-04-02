import {Link} from "react-router-dom";

export default function Login() {
  return (
    <div>
      Вход
      <Link to='/sign-up'>Регистрация</Link>
    </div>
  )
}