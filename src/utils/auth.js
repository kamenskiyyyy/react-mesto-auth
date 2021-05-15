import handleOriginalResponse from "./utils";

class Auth {
  constructor(options) {
    this.baseUrl = options.baseUrl;
  }

  register = (password, email) => {
    return fetch(`${this.baseUrl}/signup`, {
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
  }

  authorize = (password, email) => {
    return fetch(`${this.baseUrl}/signin`, {
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
  }

  getContent = (token) => {
    return fetch(`${this.baseUrl}/users/me`, {
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
  }
}

export const auth = new Auth({
  baseUrl: 'https://api.mesto.kamenskiyyyy.nomoredomains.club',
})
