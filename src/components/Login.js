import {Link} from "react-router-dom";

export default function Login({onLogin}) {
  function handleSumbit(evt) {
    evt.preventDefault();
    onLogin();
  }
  return (
    <>
    <div className="sign">
      <p className="sign__heading">Вход</p>
      <form onSubmit={handleSumbit} className="sign__form">
        <fieldset className="sign__fieldset">
          <input type="text" placeholder='Email' className="sign__input"/>
          <input type="password" placeholder='Password' className="sign__input"/>
        </fieldset>
        <button type='submit' className="sign__button">Войти</button>
      </form>
    </div>
    </>
  )
}