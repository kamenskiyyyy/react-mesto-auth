import {Link, useHistory} from "react-router-dom";
import * as auth from './../utils/auth';
import {useState} from "react";

function Register({handleRegister, handleError}) {
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
    auth.register(password, email)
      .then(res => {
        if (res !== 400) {
          handleRegister();
          history.push('./sign-in');
        } else {
          handleError(evt.target, res);
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <div className="sign">
        <p className="sign__heading">Регистрация</p>
        <form onSubmit={handleSubmit} name='register-form' className="sign__form">
          <input type="email" value={userData.email} onChange={handleChange} autoComplete='off' required placeholder='Email' className="sign__input"/>
          <input type="password" value={userData.password} onChange={handleChange} autoComplete='off' required placeholder='Password' className="sign__input"/>
          <button type='submit' className='sign__button'>Зарегистрироваться</button>
        </form>
        <div className="sign__signin">
          <span>Уже зарегистрированы?</span>
          <Link to='/sign-in' className='sign__link'>Войти</Link>
        </div>
      </div>
    </>
  )
}

export default Register;