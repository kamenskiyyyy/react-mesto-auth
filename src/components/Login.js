import {useHistory} from "react-router-dom";
import {useState} from "react";
import * as auth from './../utils/auth';

function Login({handleLogin, handleError}) {
  const history = useHistory();
  const [userData, setUserData] = useState({
    password: '',
    email: ''
  })

  function handleChange(evt) {
    const {name, value} = evt.target;
    setUserData({
      ...userData,
      [name]: value
    })
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const {password, email} = userData;
    if (!password || !email) {
      return;
    }
    auth.authorize(password, email)
      .then(data => {
        if (data.token) {
          handleLogin(email);
          history.push('/');
        } else {
          handleError(evt.target, data);
        }
      })
      .catch(err => console.error(err));
  }
  return (
    <>
    <div className="sign">
      <p className="sign__heading">Вход</p>
      <form onSubmit={handleSubmit} name='login-form' className="sign__form">
        <fieldset className="sign__fieldset">
          <input type="email" value={userData.email} onChange={handleChange} placeholder='Email' className="sign__input"/>
          <input type="password" value={userData.password} onChange={handleChange} placeholder='Password' className="sign__input"/>
        </fieldset>
        <button type='submit' className="sign__button">Войти</button>
      </form>
    </div>
    </>
  )
}

export default Login;