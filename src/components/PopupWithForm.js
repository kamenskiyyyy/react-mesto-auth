function PopupWithForm(props) {
  return (
    <div className={`popup ${props.isOpened && 'popup_opened'} popup_type_${props.name}`} onClick={(e) => {
      if (e.target.classList.contains('popup')) props.onClose()
    }}>
      <div className="popup__container">
        <button type="button" className="button button_type_close-popup" onClick={props.onClose}/>
        <form action="#" name={`${props.name}`} className="form" onSubmit={props.onSubmit} noValidate>
          {props.statusImage &&
          <img src={props.statusImage} alt="Статус запроса" className="popup__image popup__image_type_status"/>}
          <h2 className={`popup__heading`}>{props.title}</h2>
          {props.children}
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;