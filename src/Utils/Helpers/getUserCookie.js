import Cookies from "js-cookie";

export default function getUserCookie() {
  const userCookie = Cookies.get("user");
  const user = userCookie
    ? JSON.parse(userCookie.replace(/^j:/, ""))
    : undefined;
  return user;
}
