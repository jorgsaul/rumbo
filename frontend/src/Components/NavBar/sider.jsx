import "./sider.css";
import MenuOption from "./menuOption";
import IconoHome from "../iconos/iconoHome";
import IconoInformacion from "../iconos/iconoInformacion";
import AvatarPublicacion from "../avatar/avatarPublicacion";
import IconoLogout from "../iconos/iconoLogout";
import { SparklesIcon } from "../iconos/iconoSparkles";
import { ClipboardDocumentListIcon } from "../iconos/iconoClipBoardDocument";
import { useObtencionUsuario } from "../../hooks/obtencionUsuario";

function Sider({ cambioVentana, ventana }) {
  const { perfil } = useObtencionUsuario();
  const cerrarSesion = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      localStorage.removeItem("auth_token");

      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }

      const data = await response.json();

      if (data.success) {
        window.location.href = "/";
      } else {
        console.error("Error del servidor:", data.message);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="sider-rumbo">
      <div
        className="sider-perfil-usuario"
        onClick={() => cambioVentana("perfil")}
      >
        <div className="sider-perfil-avatar">
          <AvatarPublicacion urlImagen={perfil.avatar_url} />
        </div>
        <p>{perfil.full_name}</p>
      </div>
      <MenuOption
        texto={"Inicio"}
        icono={<IconoHome color={ventana == "foro" ? "white" : ""} />}
        funcion={() => cambioVentana("foro")}
        activo={ventana == "foro" ? "activo" : ""}
      />
      <MenuOption
        texto={"Test Vocacional"}
        icono={
          <SparklesIcon color={ventana == "testVocacional" ? "white" : ""} />
        }
        funcion={() => cambioVentana("testVocacional")}
        activo={ventana == "test-vocacional" ? "activo" : ""}
      />
      <MenuOption
        texto={"Tests de Conocimientos"}
        icono={
          <ClipboardDocumentListIcon
            color={ventana == "testConocimientos" ? "white" : ""}
          />
        }
        funcion={() => cambioVentana("testConocimientos")}
        activo={ventana == "test-conocimientos" ? "activo" : ""}
      />
      <MenuOption
        texto={"Recursos Externos"}
        icono={
          <IconoInformacion color={ventana == "recursos" ? "white" : ""} />
        }
        funcion={() => cambioVentana("recursos")}
        activo={ventana == "recursos" ? "activo" : ""}
      />
      <MenuOption
        texto={"Cerrar sesión"}
        icono={<IconoLogout />}
        logout={true}
        funcion={cerrarSesion}
      />
    </div>
  );
}

export default Sider;
