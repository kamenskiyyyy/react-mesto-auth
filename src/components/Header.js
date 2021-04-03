import logo from "../images/logo.svg";
import NavBar from "./NavBar";

function Header({isNavOpened, onClickNav}) {
  return (
    <header className={`header ${isNavOpened && 'header_margin_top'}`}>
      <img src={logo} alt="Место в России" className="header__logo"/>
      <NavBar
        onClickNav={onClickNav}
        isNavOpened={isNavOpened}
      />
    </header>
  )
}

export default Header;