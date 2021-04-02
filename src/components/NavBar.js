import {NavLink, useHistory} from "react-router-dom";

function NavBar({loggedIn, isNavOpened, onClickNav}) {
  const history = useHistory();

  function handleClick() {
    onClickNav(!isNavOpened);
  }

  function signOut() {
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }

  return (
    <>
      {/*  Меню мобильной версии */}
      <nav className={`nav nav_type_mobile ${isNavOpened && 'nav_opened'}`}>
        <ul className="nav__list nav__list_type_mobile">
          <li className="nav__item nav__item_type_mobile">profile-email</li>
          <li className="nav__item">
            <button type='button' className="button button_type_logout" onClick={signOut}>Выйти</button>
          </li>
        </ul>
      </nav>
      {/*  Меню неавторизованный пользователь */}
      {!loggedIn &&
      <nav className='nav'>
        <ul className="nav__list">
          <li className="nav__item"><NavLink className='nav__link' to='/sign-in'
                                             activeClassName='nav__link_active'>Войти</NavLink></li>
          <li className="nav__item"><NavLink className='nav__link' to='/sign-up'
                                             activeClassName='nav__link_active'>Регистрация</NavLink></li>
        </ul>
      </nav>
      }
      {/*  Меню авторизованный пользователь */}
      {loggedIn &&
        <nav className="nav">
          <button type='button' className={`button button_type_open-nav ${isNavOpened && 'button_type_close-nav'}`} onClick={handleClick}/>
          <ul className="nav__list nav__list_authorized">
            <li className='nav__item nav__item_margin_right'>profile-email</li>
            <li className='nav__item'><button type='button' className='button button_type_logout' onClick={signOut}>Выйти</button></li>
          </ul>
        </nav>
      }
    </>
  )
}

export default NavBar;