import AuthApi from '../apis/AuthApi';

/**
 * Returns a username after authenticating the token in the localstorage
 * 
 * @throws throws an error when authentication fails
 * @returns {string} username
 */
export async function getUsernameFromTokenAuthentication() {
  try {
    const response = await AuthApi.get("/is-verify", { headers: { token: localStorage.getItem("token") } });
    if (response.data.isAuthenticated) {
      return response.data.username;
    } else {
      throw Object.assign(
        new Error("invalid user"),
        { code: 401 }
      );
    }
  } catch (error) {
    localStorage.removeItem("token");
    throw error
  }
}