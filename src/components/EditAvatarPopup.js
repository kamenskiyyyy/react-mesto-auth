import {useRef} from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar, isLoadingButtonText}) {
  const inputAvatar = useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: inputAvatar.current.value
    });
    inputAvatar.current.value = '';
  }

  return (
    <PopupWithForm
      isOpened={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="update-avatar"
      title="Обновить аватар"
    >
      <label className="form__field">
        <input
          type="url"
          name="avatar-link"
          id="avatar-link-input"
          ref={inputAvatar}
          className="form__input form__input_size_small form__input_el_avatar-link"
          placeholder="Ссылка на изображение"
          required
          autoComplete="off"/>
        <span className="form__input-error avatar-link-input-error"/>
      </label>
      <button type="submit"
              className="button button_type_submit">{isLoadingButtonText ? 'Сохранение...' : 'Сохранить'}</button>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;