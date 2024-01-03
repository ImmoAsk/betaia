import axios, { AxiosInstance } from "axios";
//import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class AuthService {
  protected readonly instance: AxiosInstance;
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  login = (username: string, password: string) => {
    return this.instance
      .get(`api/v2?query=mutation{login(input:{username:"${username}",password:"${password}"}){access_token,expires_in,refresh_token,user{name,id,email}}}`)
      .then((res) => {
        console.log(res);
        return {
          username: res.data.login.name,
          //avatar: res.data.login.avatar,
          id: res.data.login.user.id,
          accessToken: res.data.login.access_token,
          expiredAt: res.data.login.expires_in,
        };
      });
  };

  /* getMe = (userId: string) => {
    return this.instance
      .get(`/users/${userId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => {
        return res.data;
      });
  };

  uploadAvatar = (userId: string, newAvatar: File) => {
    const formData = new FormData();
    formData.append("file", newAvatar);
    return this.instance
      .post(`/users/${userId}/upload`, formData, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => {
        return {
          newAvatar: res.data.data.url,
        };
      });
  }; */
}
