import handleOriginalResponse from "./utils";

export const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password, email})
  })
    .then(handleOriginalResponse)
    .then(data => {
      if (data) {
        return data;
      }
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password, email})
  })
    .then(handleOriginalResponse)
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        return data;
      }
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
  })
    .then(handleOriginalResponse)
    .then(data => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}