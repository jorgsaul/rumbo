import ButtonGhost from "../botones/buttonGhost";
import Button from "../botones/buttonPrimary";
import InputBasic from "../forms/inputBasic";
import { useCodeVerification } from "../../hooks/verificacionCodigo";
import './cardPaso3.css';

function RegistroPaso3({ paso, datos }) {
  const {
    codigo,
    error,
    setError,
    loading,
    verificarCodigo,
    handleCodigoChange,
  } = useCodeVerification();

  const handleContinuar = async () => {
    if (codigo.length !== 4) {
      setError(true);
      return;
    }

    try {
      const esValido = await verificarCodigo(datos.correo, datos.codigo, codigo);
      if (esValido) {
        paso('paso4');
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="paso3-contenedor">
      <p>Te enviamos un código a tu correo electrónico</p>
      <InputBasic 
        holder={'Ingresa tu código de 4 dígitos'} 
        onChange={e => handleCodigoChange(e.target.value)} 
        error={error} 
        errorMessage={'El código es incorrecto o ha expirado'}
        disabled={loading}
      />
      <div className="paso3-contenedor-botones">
        <ButtonGhost 
          text={'Regresar'} 
          enable={!loading} 
          action={() => paso('paso2')}
        />
        <Button 
          text={loading ? 'Verificando...' : 'Continuar'} 
          enable={!!codigo && !loading} 
          action={handleContinuar}
        />
      </div>
    </div>
  );
}

export default RegistroPaso3;