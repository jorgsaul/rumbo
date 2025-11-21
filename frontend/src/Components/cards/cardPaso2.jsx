function RegistroPaso2({ paso, setDatos, datos, esRegistro }) {
  const {
    email,
    setEmail,
    error,
    setError,
    mensaje,
    setMensaje,
    loading,
    setLoading,
    codigo,
    setCodigo,
    validarEmail,
    enviarCodigo,
    handleEmailChange,
  } = useEmailVerification(datos.correo, esRegistro);

  useEffect(() => {
    if (datos.correo) {
      setEmail(datos.correo);
    }
  }, [datos.correo, setEmail]);

  const handleContinuar = async () => {
    if (loading) return;
    setLoading(true);
    setError(false);
    setMensaje("");

    try {
      const errorMsg = await validarEmail(email);
      if (errorMsg) {
        setError(true);
        setMensaje(errorMsg);
        setLoading(false);
        return;
      }

      setDatos((prev) => ({ ...prev, correo: email }));
      const codigoEnviado = await enviarCodigo(email);
      setCodigo(codigoEnviado);
      setDatos((prev) => ({ ...prev, codigo: codigoEnviado }));
      paso("paso3");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      setError(true);
      setMensaje("Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Ingresa tu correo electrónico</p>
      <InputBasic
        type={"email"}
        holder={"Correo electrónico"}
        required={true}
        value={email}
        onChange={(e) => handleEmailChange(e.target.value)}
        error={error}
        errorMessage={mensaje}
        disabled={loading}
      />
      <div className="paso2-button-container">
        <div>
          {esRegistro ? (
            <ButtonGhost
              text={"Regresar"}
              enable={!loading}
              action={() => paso("paso1")}
            />
          ) : null}
        </div>
        <div>
          <Button
            text={loading ? "Validando..." : "Continuar"}
            enable={!!email && !loading}
            action={handleContinuar}
          />
        </div>
      </div>
    </div>
  );
}

export default RegistroPaso2;
