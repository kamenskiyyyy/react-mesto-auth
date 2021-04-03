import PopupWithForm from "./PopupWithForm";

function InfoTooltip({isOpen, onClose, statusImage, statusMessage}) {
  return (
    <PopupWithForm
      isOpened={isOpen}
      onClose={onClose}
      name="sign-status"
      statusImage={statusImage}
      title={statusMessage}
    />
  )
}

export default InfoTooltip;