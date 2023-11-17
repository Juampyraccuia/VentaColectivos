export const Pasajeros = () => {
  return (
    <form>
      <label>
        Nombre:
        <input type="text" />
      </label>
      <br />
      <br />
      <label>
        Apellido:
        <input type="text" />
      </label>
      <br />
      <br />
      <label>
        DNI:
        <input type="number" />
      </label>
      <br />
      <br />
      <label>
        Fecha de Nacimiento:
        <input type="date" />
      </label>
      <br />
      <br />
      <button type="button">Agregar pasajero</button>
      <button type="button">Borrar pasajero</button>
    </form>
  );
};
