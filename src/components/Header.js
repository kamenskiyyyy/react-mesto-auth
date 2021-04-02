import logo from "../images/logo.svg";
import NavBar from "./NavBar";

function Header({loggedIn, isNavOpened, onClickNav}) {
    return (
        <header className={`header ${isNavOpened && 'header_margin_top'}`}>
            <img className="header__logo" src={logo} alt="Логотип"/>
            <NavBar
              loggedIn={loggedIn}
              onClickNav={onClickNav}
              isNavOpened={isNavOpened}
            />
        </header>
    )
}

export default Header;