import "./cardNuevaPublicacion.css";
import AvatarPublicacion from "../avatar/avatarPublicacion";
import ButtonPrimary from "../botones/buttonPrimary";
import IconoImagen from "../iconos/iconoImagen";
import InputInvisible from "../forms/inputInvisible";
import CascadeMenu from "../forms/cascadeMenu";
import { useNuevaPublicacion } from "../../hooks/subidaPublicaciones";

function CardNuevaPublicacion({ usuario, onPostSuccess }) {
  const {
    fileInputRef,
    imagenSeleccionada,
    preview,
    subiendoImagen,
    abrirSelectorImagen,
    manejarCambioImagen,
    titulo,
    contenido,
    setTitulo,
    setContenido,
    handlePostClick,
    canPost,
    limpiarCampos,
    selectedEtiquetas,
    handleCheckboxChange,
  } = useNuevaPublicacion(usuario);

  const handeClickPublicar = async () => {
    const exito = await handlePostClick();
    if (exito) {
      limpiarCampos();
      onPostSuccess?.();
    }
  };
  return (
    <div className="card card-nueva-publicacion">
      <div className="avatar-container">
        <div className="img-avatar-container">
          <AvatarPublicacion urlImagen={usuario.avatar_url} />
        </div>
      </div>
      <div className="publicacion">
        <InputInvisible
          holder="Escribe el título de tu publicación"
          type="text"
          maxLength={45}
          className="input-titulo input-publicacion-nueva"
          id="postTitulo"
          onChange={(e) => setTitulo(e.target.value)}
          value={titulo}
        />

        <InputInvisible
          holder="Escribe aquí tu duda o tema"
          type="text"
          maxLength={1000}
          className="input-publicacion-nueva"
          id="postContenido"
          onChange={(e) => setContenido(e.target.value)}
          value={contenido}
        />

        <div className="contenedor-multimedia">
          {preview && <img src={preview} alt="preview" />}
        </div>

        <div className="contenedor-opciones">
          <div className="contenedor-recursos-extra">
            <div className="contenedor-icono-imagen">
              <IconoImagen funcion={abrirSelectorImagen} />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={manejarCambioImagen}
                id="postMultimedia"
              />
            </div>
            <CascadeMenu
              selectedEtiquetas={selectedEtiquetas}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
          <div>
            <ButtonPrimary
              text="Publicar"
              enable={canPost}
              className="boton-publicar compact"
              action={handeClickPublicar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default CardNuevaPublicacion;
