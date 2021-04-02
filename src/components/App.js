import {useState, useEffect} from 'react';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import AddPlacePopup from "./AddPlacePopup";
import {Route, Switch, useHistory} from 'react-router-dom';
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import {statusErrors, statusSuccessMessage} from "../utils/constants";
import InfoTooltip from "./InfoTooltip";
import statusSuccessImage from './../images/success.svg';
import statusErrorImage from './../images/error.svg';
import * as auth from './../utils/auth';
import {AppContext} from "../contexts/AppContext";

function App() {
  const history = useHistory();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);        // Стейт попап редактирования профиля открыт
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);              // Стейт попап добавить карточку открыт
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);          // Стейт попап редактирования аватара открыт
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);      // Стейт попап подтверждения удаления карточки открыт
  const [selectedCard, setSelectedCard] = useState(null);                             // Стейт выбранная карточка для передачи картинки карточки в попап
  const [currentUser, setCurrentUser] = useState({name: '', about: '', email: ''});   // Стейт данные текущего пользователя
  const [deletedCard, setDeletedCard] = useState(null);                               // Стейт выбранная карточка для удаления
  const [cards, setCards] = useState([]);                                             // Стейт массив карточек
  const [loggedIn, setLoggedIn] = useState(false);                                    // Стейт-переменная статус пользователя, вход в систему
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);                  // Стейт попап редактирования аватара открыт
  const [isNavOpened, setIsNavOpened] = useState(false);                              // Стейт мобильная навигация открыта
  const [isLoadingCards, setIsLoadingCards] = useState(true);                         // Стейт прелоадер загрузки карточек
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);                   // Стейт прелоадер загрузки информации пользователя
  const [isLoadingButtonText, setIsLoadingButtonText] = useState(false);              // Стейт надпись на кнопке при сохранении контента
  const [userEmail, setUserEmail] = useState('');                                     // Стейт email пользователя
  const [infoTooltip, setInfoTooltip] = useState({                                    // Стейт информационного попапа статуса
    isOpen: false,
    image: statusSuccessImage,
    message: statusSuccessMessage
  });

  // Обработчик клика по аватару
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  // Обработчик клика по кнопке редактирования профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  // Обработчик клика по кнопке добавить карточку
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  // Обработчик клика по кнопке удалить карточку
  function handleCardDelete(card) {
    setIsConfirmationPopupOpen(true);
    setDeletedCard(card);
  }

  // Функция закрытия всех попапов
  function closeAllPopups() {
    setInfoTooltip({
      ...infoTooltip,
      isOpen: false
    });
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setSelectedCard(null);
  }

  // Обработчик клика по картинке карточки
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // Обработчик обновления информации пользователя
  function handleUpdateUser(userInfo) {
    setIsLoadingButtonText(true);
    api.editProfile(userInfo)
      .then(data => {
        setCurrentUser({...data});
        closeAllPopups();
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoadingButtonText(false);
      })
  }

  // Обработчик обновления аватара
  function handleUpdateAvatar({avatar}) {
    setIsLoadingButtonText(true);
    api.updateAvatar(avatar)
      .then(data => {
        setCurrentUser({...data});
        closeAllPopups();
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoadingButtonText(false);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then(newCard => {
        setCards(cards => cards.map(c => c._id === card._id ? newCard : c));
      })
      .catch(err => console.error(err));
  }

  // Обработчик подтверждения удаления карточки
  function handleCardDeleteSubmit(cardId) {
    setIsLoadingButtonText(true);
    api.deleteCard(cardId)
      .then(() => {
        setCards(cards.filter(c => c._id !== cardId));
        closeAllPopups();
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoadingButtonText(false);
      })
  }

  // Обработчик добавления карточки
  function handleAddPlaceSubmit(cardInfo) {
    setIsLoadingButtonText(true);
    api.addCard(cardInfo)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoadingButtonText(false);
      })
  }

  // Обработчик по кнопке Войти
  function handleLogin(email) {
    setLoggedIn(true);
    setUserEmail(email);
  }

  // Обработчик по кнопке Зарегистрироваться
  function handleRegister() {
    setInfoTooltip({
      ...infoTooltip,
      isOpen: true,
      image: statusSuccessImage,
      message: statusSuccessMessage
    });
  }

  // Обработчик ошибки по кнопке Войти
  function handleError(form, statusError) {
    const errors = statusErrors.filter(error => error.name === form.name)[0].errors;
    const statusErrorMessage = errors.filter(error => error.status === statusError)[0].message;
    setInfoTooltip({
      ...infoTooltip,
      isOpen: true,
      image: statusErrorImage,
      message: statusErrorMessage
    });
  }

  // Обработчик клика по меню
  function handleNavClick() {
    setIsNavOpened(!isNavOpened);
  }

  function signOut() {
    setLoggedIn(false);
    setIsNavOpened(false);
    localStorage.removeItem('token');
    history.push('./sign-in');
  }

  // Проверка токена при повторном посещении сайта
  function tokenCheck() {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then(res => {
          if (res) {
            setUserEmail(res.data.email);
            setLoggedIn(true);
            history.push('/');
          }
        })
    } else {
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    tokenCheck();
  }, []);

  // Загрузка карточек по умолчанию
  useEffect(() => {
    api.getInitialCards()
      .then(initialCards => {
        setCards(initialCards);
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoadingCards(false);
      })
  }, []);

  // Добавить/удалить слушателя нажатия Esc при открытии попапа
  useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }

    (isEditProfilePopupOpen
      || infoTooltip.isOpen
      || isAddPlacePopupOpen
      || isEditAvatarPopupOpen
      || isConfirmationPopupOpen
      || selectedCard) && document.addEventListener('keydown', handleEscClose);

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    }
  }, [infoTooltip.isOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, isConfirmationPopupOpen, selectedCard, closeAllPopups]);

  // Загрузка данных пользователя
  useEffect(() => {
    api.getUserInfo()
      .then(data => {
        setCurrentUser({...data});
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsLoadingUserInfo(false);
      })
  }, []);

  return (
    <AppContext.Provider value={{loggedIn, userEmail, handleLogin, signOut}}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <div className="page__container">
            <Header
              isNavOpened={isNavOpened}
              onClickNav={handleNavClick}
            />
            <Switch>
              <Route path='/sign-up'>
                <Register
                  handleRegister={handleRegister}
                  handleError={handleError}
                />
              </Route>
              <Route path='sign-in'>
                <Login
                  handleLogin={handleLogin}
                  handleError={handleError}
                />
              </Route>
              <ProtectedRoute
                exact path='/'
                component={Main}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
              />
              <Route path='/'>
                <Register to='/'/>
              </Route>
            </Switch>
            {loggedIn && <Footer/>}
            {/*Попап редактировать профиль*/}
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              buttonText='Сохранить'
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              isLoadingButtonText={isLoadingButtonText}/>
            {/*Попап добавить карточку*/}
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
              isLoadingButtonText={isLoadingButtonText}/>
            {/*Попап картинка*/}
            <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}/>
            {/*Попап удаления карточки*/}
            <ConfirmationPopup
              isOpen={isConfirmationPopupOpen}
              onClose={closeAllPopups}
              onCardDelete={handleCardDeleteSubmit}
              card={deletedCard}
              isLoadingButtonText={isLoadingButtonText}/>
            {/*Попап обновить аватар*/}
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              isLoadingButtonText={isLoadingButtonText}/>
            {/* <!-- Попап статус подтверждение --> */}
            <InfoTooltip
              isOpen={infoTooltip.isOpen}
              onClose={closeAllPopups}
              statusImage={infoTooltip.image}
              statusText={infoTooltip.message}
            />
          </div>
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
