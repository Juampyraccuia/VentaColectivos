export const LoginPage = () => {
  return (
    <>
      <form>
        <label htmlFor="usuario">Usuario:</label>
        <input name="usuario" type="text" />
        <label htmlFor="password"> Contraseña:</label>
        <input name="password" type="password" />
        <button type="submit">Ingresar</button>
      </form>
    </>
  );
};
