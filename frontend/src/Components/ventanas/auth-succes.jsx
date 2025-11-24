import { useEffect } from "react";
function AuthSuccess() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("auth_token", token);
      window.history.replaceState({}, "", "/");
      window.location.href = "/foro";
    }
  }, []);

  return <div>Procesando...</div>;
}

export default AuthSuccess;
