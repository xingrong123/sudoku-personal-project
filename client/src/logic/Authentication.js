import AuthApi from '../apis/AuthApi';

export async function getUsernameFromTokenAuthencation() {
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