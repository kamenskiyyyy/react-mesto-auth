import {useState} from 'react';

function Login({handleLogin}) {
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
    handleLogin(evt, password, email);
  }

  return (
    <>
      <div className="sign">
        <p className="sign__heading">Вход</p>
        <form
          name="login-form"
          className="sign__form"
          onSubmit={handleSubmit}>
          <fieldset className="sign__fieldset">
            <input
              type="email"
              name="email"
              value={userData.email}
              className="sign__input"
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              value={userData.password}
              className="sign__input"
              onChange={handleChange}
              placeholder="Пароль"
            />
          </fieldset>
          <button type="submit" className="sign__button">Войти</button>
        </form>
      </div>
    </>
  )
}

export default Login;