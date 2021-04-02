import {Link} from "react-router-dom";

function Register({onRegister}) {
  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister();
  }

  return (
    <>
      <div className="sign">
        <p className="sign__heading">Регистрация</p>
        <form onSubmit={handleSubmit} className="sign__form">
          <input type="email" placeholder='Email' className="sign__input"/>
          <input type="password" placeholder='Password' className="sign__input"/>
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