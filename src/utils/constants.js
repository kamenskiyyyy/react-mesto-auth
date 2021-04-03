export const statusSuccessMessage = 'Вы успешно зарегистрировались!';
export const statusErrorText = 'Что-то пошло не так! Попробуйте еще раз.';

export const statusErrors = [
  {
    name: 'login-form',
    errors: [
      {
        status: 400,
        message: 'Не передано одно из полей.'
      },
      {
        status: 401,
        message: 'Пользователь не найден. Проверьте Email и Пароль.'
      }
    ]
  },
  {
    name: 'register-form',
    errors: [
      {
        status: 400,
        message: 'Некорректно заполнено одно из полей. Попробуйте еще раз.'
      }
    ]
  }
];
