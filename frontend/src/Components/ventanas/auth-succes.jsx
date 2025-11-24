function AuthSuccess() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("auth_token", token); // ✅ Guardar en localStorage
      window.history.replaceState({}, "", "/"); // Limpiar URL
      window.location.href = "/foro"; // Redirigir
    }
  }, []);

  return <div>Procesando...</div>;
}

export default AuthSuccess;
