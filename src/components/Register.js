import {useState} from 'react';
import {Link} from 'react-router-dom';

function Register({handleRegister}) {
  const [userData, setUserData] = useState({
    password: '',
    email: ''
  });

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
    handleRegister(evt, password, email);
  }

  return (
    <>
      <div className="sign">
        <p className="sign__heading">Регистрация</p>
        <form
          name="register-form"
          className="sign__form"
          onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={userData.email}
            className="sign__input"
            onChange={handleChange}
            placeholder="Email"
            autoComplete="off"
            required
          />
          <input
            type="password"
            name="password"
            value={userData.password}
            className="sign__input"
            onChange={handleChange}
            placeholder="Пароль"
            autoComplete="off"
            required
          />
          <button type="submit" className="sign__button">Зарегистрироваться</button>
        </form>
        <div className="sign__signin">
          <span>Уже зарегистрированы?</span>
          <Link to="./sign-in" className="sign__link">Войти</Link>
        </div>
      </div>
    </>
  );
}

export default Register;