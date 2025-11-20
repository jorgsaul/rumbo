import "./ventanaPerfil.css";
import AvatarPublicacion from "../avatar/avatarPublicacion";
import NavTab from "../NavBar/navTab";
import { useEffect, useState } from "react";
import VentanaForo from "./ventanaForo";
import IconoEditar from "../iconos/iconoEdit";
import {
  useObtencionUsuario,
  useObtencionUsuarioExterno,
} from "../../hooks/obtencionUsuario.js";
import { useSubidaImagen } from "../../hooks/subidaImagenes";
import { useParams } from "react-router-dom";
import InputInvisible from "../forms/inputInvisible.jsx";
import Button from "../botones/buttonPrimary.jsx";
import ButtonOutline from "../botones/buttonOutline.jsx";

function VentanaPerfil() {
  const { idUsuario } = useParams();
  const { perfil: perfilPropio } = useObtencionUsuario();
  const { perfil: perfilExterno } = useObtencionUsuarioExterno(idUsuario);
  const [subVentana, setSubVentana] = useState("publicaciones");
  const [editar, setEditar] = useState(false);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const {
    fileInputRef,
    subiendoImagen,
    abrirSelectorImagen,
    manejarCambioImagen,
    limpiarImagen,
    imagenSeleccionada,
  } = useSubidaImagen();

  useEffect(() => {
    if (imagenSeleccionada) {
      if (editando === "banner") {
        setObjetosEditables({
          ...objetosEditables,
          banner_url: imagenSeleccionada,
        });
      } else if (editando === "avatar") {
        setObjetosEditables({
          ...objetosEditables,
          avatar_url: imagenSeleccionada,
        });
      }
    }
  }, [imagenSeleccionada]);

  const perfil = !idUsuario ? perfilPropio : perfilExterno;
  const miPerfil = !idUsuario || idUsuario === perfilPropio.id;

  const [datosOriginales, setDatosOriginales] = useState({});
  const [objetosEditables, setObjetosEditables] = useState({
    full_name: "",
    avatar_url: "",
    banner_url: "",
    bio: "",
    username: "",
  });

  useEffect(() => {
    if (!perfil) return;
    setObjetosEditables({
      full_name: perfil.full_name,
      avatar_url: perfil.avatar_url,
      banner_url: perfil.banner_url,
      bio: perfil.bio,
      username: perfil.username,
    });
    setDatosOriginales({
      full_name: perfil.full_name,
      avatar_url: perfil.avatar_url,
      banner_url: perfil.banner_url,
      bio: perfil.bio,
      username: perfil.username,
    });
  }, [perfil]);

  const handleEditar = async () => {
    setError(false);
    setMensaje("");

    if (!objetosEditables.bio || !objetosEditables.full_name) {
      setError(true);
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/actualizar-perfil`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(objetosEditables),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const result = await response.json();
      console.log("✅ Perfil actualizado:", result);

      setEditar(false);
      window.location.reload();
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      setError(true);
      setMensaje("Error al actualizar el perfil");
    }
  };

  const handleCancelar = () => {
    setObjetosEditables(datosOriginales);
    limpiarImagen();
    setPreviewAvatar(null);
    setPreviewBanner(null);
    setEditar(false);
  };

  const seleccionarImagen = (tipo) => {
    setEditando(tipo);
    abrirSelectorImagen();
  };

  const handleCambioArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    manejarCambioImagen(e);
    const url = URL.createObjectURL(file);
    if (editando === "avatar") setPreviewAvatar(url);
    if (editando === "banner") setPreviewBanner(url);
  };

  if (!perfil) return <div>Cargando perfil...</div>;

  return (
    <div className="contenedor-ventana-perfil">
      <div className="contenedor-perfil-banner">
        <div
          className={`contenedor-perfil-banner ${editar ? "editar" : ""}`}
          style={{
            backgroundImage: `url(${previewBanner || perfil.banner_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {editar && miPerfil && (
            <div
              className="banner-editar-overlay"
              onClick={() => seleccionarImagen("banner")}
            >
              ✎
            </div>
          )}
        </div>

        <div
          className={`contenedor-imagen-ventana-perfil ${
            editar ? "editar" : ""
          }`}
        >
          <AvatarPublicacion
            urlImagen={previewAvatar || perfil.avatar_url}
            className={editar ? "avatar-imagen-perfil" : ""}
          />
          {editar && miPerfil && (
            <div
              className="avatar-editar-overlay"
              onClick={() => seleccionarImagen("avatar")}
            >
              ✎
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleCambioArchivo}
        />
      </div>

      <div className="contenedor-perfil">
        <div className="contenedor-datos-perfil">
          <div className="datos-perfil">
            <h1>
              {editar ? (
                <InputInvisible
                  holder={perfil.full_name}
                  className={"input-titulo-perfil"}
                  value={objetosEditables.full_name}
                  onChange={(e) =>
                    setObjetosEditables({
                      ...objetosEditables,
                      full_name: e.target.value,
                    })
                  }
                  maxLength={20}
                />
              ) : (
                perfil.full_name
              )}
            </h1>
            <p>@{perfil.username}</p>

            <div className="contenedor-botones-perfil">
              {miPerfil &&
                (!editar ? (
                  <IconoEditar
                    funcion={() => {
                      setEditar(true);
                    }}
                  />
                ) : (
                  <>
                    <ButtonOutline
                      text="Cancelar"
                      funcion={handleCancelar}
                      className="boton-etiquetas"
                      enable={true}
                    />
                    <Button
                      text={subiendoImagen ? "Subiendo..." : "Guardar"}
                      action={handleEditar}
                      className="boton-editar-perfil"
                      enable={!subiendoImagen && !error}
                    />
                  </>
                ))}
            </div>
          </div>

          <div className="contenedor-descripcion-perfil">
            <p>
              {editar ? (
                <InputInvisible
                  holder={perfil.bio}
                  maxLength={200}
                  className="input-bio-perfil"
                  value={objetosEditables.bio}
                  onChange={(e) =>
                    setObjetosEditables({
                      ...objetosEditables,
                      bio: e.target.value,
                    })
                  }
                />
              ) : (
                perfil.bio
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="contenedor-navtab-perfil">
        <NavTab setSubVentana={setSubVentana} />
      </div>
      <div className="sub-ventana-perfil">
        <VentanaForo ventanaActual={subVentana} perfil={perfil} />
      </div>
    </div>
  );
}

export default VentanaPerfil;
