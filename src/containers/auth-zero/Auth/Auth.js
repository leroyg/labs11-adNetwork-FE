import auth0 from "auth0-js";
import { AUTH_CONFIG } from "./auth0-variables";
import history from "../history";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  userProfile;
  tokenRenewalTimeout;

  // Auth Config
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: "token id_token",
    scope: "openid profile email offline_access",
    sso: false
  });

  // handle login built in function from Auth0
  login = () => {
    this.auth0.authorize();
  };

  //once user is authenticated with login we will invoke setSession
  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.log(err);
        history.replace("/");
      }
    });
  };

  //gett access token
  getAccessToken = () => {
    return this.accessToken;
  };

  // get user token
  getIdToken = () => {
    return this.idToken;
  };

  // once user is authenticated we will make a request to lad backend and create this user to our backend if it does not exists
  setSession = authResult => {
    // Set the time that the access token will expire at
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    // Set isLoggedIn flag in localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);

    // schedule a token renewal
    const decoded = jwtDecode(localStorage.id_token && localStorage.id_token);
    const user = {
      name: decoded.name,
      email: decoded.email,
      image_url: decoded.picture,
      nickname: decoded.nickname,
      sub: decoded.sub,
      acct_type: localStorage.getItem("acct_type") || "advertiser"
    };
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.id_token}`
      }
    };

    axios
      .post(`https://lad-network.herokuapp.com/api/auth/register`, user, config)
      .then(res => {
        // console.log('--- hit response -- ', res.data)
      })
      .catch(err => {
        // if there's error with registering user with our backend clear localstorage and redirect to landing page
        window.localStorage.clear();
        history.replace("/");
      });
    history.replace("/dashboard");
  };

  // logout user
  logout = () => {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    localStorage.clear();
    sessionStorage.clear();
    // navigate to the home route
    auth0.logout({
      returnTo: "http://ladnetwork.auth0.com/v2/logout",
      client_id: "XQh6ZLLicvNOdZUMBrCvmL2zyrgmE1fB"
    });

    history.replace("/");
  };
}
