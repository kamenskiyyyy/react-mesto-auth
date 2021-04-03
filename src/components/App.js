import {useState, useEffect} from 'react';
import {Route, Switch, Redirect, useHistory} from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import ImagePopup from './ImagePopup';
import {api, auth} from '../utils/api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {AppContext} from '../contexts/AppContext';
import avatarDefault from './../images/profile__avatar.svg';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import statusSuccessImage from './../images/success.svg';
import statusErrorImage from './../images/error.svg';
import {statusErrors, statusSuccessMessage} from '../utils/constants';

function App() {
  const history = useHistory();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);                       // Стейт попап редактирования профиля открыт
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);                             // Стейт попап добавить карточку открыт
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);                         // Стейт попап редактирования аватара открыт
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);                     // Стейт попап подтверждения удаления карточки открыт
  const [selectedCard, setSelectedCard] = useState(null);                                            // Стейт выбранная карточка для передачи картинки карточки в попап
  const [deletedCard, setDeletedCard] = useState(null);                                              // Стейт выбранная карточка для удаления
  const [currentUser, setCurrentUser] = useState({                                                   // Стейт данные текущего пользователя
    name: '',
    about: '',
    email: '',
    avatar: avatarDefault
  });
  const [cards, setCards] = useState([]);                                                            // Стейт массив карточек
  const [loggedIn, setLoggedIn] = useState(false);                                                   // Стейт-переменная статус пользователя, вход в систему
  const [infoTooltip, setInfoTooltip] = useState({                                                   // Стейт информационного попапа статуса
    isOpen: false,
    image: statusSuccessImage,
    message: statusSuccessMessage
  });
  const [isNavOpened, setIsNavOpened] = useState(false);                                             // Стейт мобильная навигация открыта
  const [userEmail, setUserEmail] = useState('');                                                    // Стейт email пользователя
  const [isLoadingCards, setIsLoadingCards] = useState(true);                                        // Стейт прелоадер загрузки карточек
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);                                  // Стейт прелоадер загрузки информации пользователя
  const [isLoadingButtonText, setIsLoadingButtonText] = useState(false);                             // Стейт надпись на кнопке при сохранении контента

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
        setIsLoadingButtonText(false);
      })
      .catch(err => console.log(err));
  }

  // Обработчик обновления аватара
  function handleUpdateAvatar({avatar}) {
    setIsLoadingButtonText(true);
    api.updateAvatar(avatar)
      .then(data => {
        setCurrentUser({...data});
        closeAllPopups();
        setIsLoadingButtonText(false);
      })
      .catch(err => console.log(err));
  }

  // Обработчик лайка картинки
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then(newCard => {
        const newCards = cards.map(c => c._id === card._id ? newCard : c);
        setCards(newCards);
      })
      .catch(err => console.log(err));
  }

  // Обработчик подтверждения удаления карточки
  function handleCardDeleteSubmit(cardId) {
    setIsLoadingButtonText(true);
    api.deleteCard(cardId)
      .then(() => {
        const newCards = cards.filter(c => c._id !== cardId);
        setCards(newCards);
        closeAllPopups();
        setIsLoadingButtonText(false);
      })
      .catch(err => console.log(err));
  }

  // Обработчик добавления карточки
  function handleAddPlaceSubmit(cardInfo) {
    setIsLoadingButtonText(true);
    api.addCard(cardInfo)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
        setIsLoadingButtonText(false);
      })
      .catch(err => console.log(err));
  }

  // Обработчик по кнопке Войти
  function handleLogin(evt, password, email) {
    auth.authorize(password, email)
      .then(data => {
        if (data.token) {
          setLoggedIn(true);
          setUserEmail(email);
          history.push('/');
        } else {
          handleError(evt.target, data);
        }
      })
      .catch(err => console.log(err));                                          // По указанным Логину и Паролю пользователь не найден. Проверьте введенные данные и повторите попытку. 
  }

  // Обработчик по кнопке Зарегистрироваться
  function handleRegister(evt, password, email) {
    auth.register(password, email)
      .then(res => {
        if (res !== 400) {
          setInfoTooltip({
            ...infoTooltip,
            isOpen: true,
            image: statusSuccessImage,
            message: statusSuccessMessage
          });
          history.push('./sign-in');
        } else {
          handleError(evt.target, res);
        }
      })
      .catch(err => console.log(err));                                                                // Обработка ошибки handleError();
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

  // Выход из аккаунта
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
        setIsLoadingCards(false);
      })
      .catch(err => console.log(err));
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
        setIsLoadingUserInfo(false);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <AppContext.Provider value={{loggedIn, userEmail, handleLogin, signOut}}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page__container">
          <Header
            isNavOpened={isNavOpened}
            onClickNav={handleNavClick}
          />
          <Switch>
            <Route path="/sign-up">
              <Register
                handleRegister={handleRegister}
                handleError={handleError}
              />
            </Route>
            <Route path="/sign-in">
              <Login
                handleLogin={handleLogin}
                handleError={handleError}
              />
            </Route>
            <ProtectedRoute
              exact path="/"
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
              isLoadingCards={isLoadingCards}
              isLoadingUserInfo={isLoadingUserInfo}
            >
            </ProtectedRoute>
            <Route path="/">
              <Redirect to="/"/>
            </Route>
          </Switch>
          {loggedIn && <Footer/>}
          {/* <!-- Попап редактировать профиль --> */}
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoadingButtonText={isLoadingButtonText}
          />
          {/* <!-- Попап добавить карточку --> */}
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoadingButtonText={isLoadingButtonText}
          />
          {/* <!-- Попап картинка --> */}
          <ImagePopup
            onClose={closeAllPopups}
            card={selectedCard}
          />
          {/* <!-- Попап удаления карточки --> */}
          <ConfirmationPopup
            isOpen={isConfirmationPopupOpen}
            onClose={closeAllPopups}
            onCardDelete={handleCardDeleteSubmit}
            card={deletedCard}
            isLoadingButtonText={isLoadingButtonText}
          />

          {/* <!-- Попап обновить аватар --> */}
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoadingButtonText={isLoadingButtonText}
          />

          {/* <!-- Попап статус подтверждение --> */}
          <InfoTooltip
            isOpen={infoTooltip.isOpen}
            onClose={closeAllPopups}
            statusImage={infoTooltip.image}
            statusMessage={infoTooltip.message}
          />
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
