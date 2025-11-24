import "./sider.css";
import MenuOption from "./menuOption";
import IconoHome from "../iconos/iconoHome";
import IconoInformacion from "../iconos/iconoInformacion";
import IconoEscuela from "../iconos/iconoEscuela";
import AvatarPublicacion from "../avatar/avatarPublicacion";
import IconoComparar from "../iconos/iconoComparar";
import IconoLogout from "../iconos/iconoLogout";
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
        texto={"Recursos"}
        icono={
          <IconoInformacion color={ventana == "recursos" ? "white" : ""} />
        }
        funcion={() => cambioVentana("recursos")}
        activo={ventana == "recursos" ? "activo" : ""}
      />

      <MenuOption
        texto={"Oferta Educativa"}
        icono={<IconoEscuela color={ventana == "informacion" ? "white" : ""} />}
        funcion={() =>
          window.open("https://www.ipn.mx/oferta-educativa/educacion-superior/")
        }
        activo={ventana == "informacion" ? "activo" : ""}
      />

      <MenuOption
        texto={"Compara tus carreras"}
        icono={<IconoComparar color={ventana == "comparar" ? "white" : ""} />}
        funcion={() =>
          window.open(
            "https://comparacarreras.imco.org.mx/?gad_campaignid=1463017670"
          )
        }
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
