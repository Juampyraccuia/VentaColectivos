export const Boleto = () => {
  return (
    <form>
      <label>
        Usuario:
        <input type="text" />
      </label>
      <br />
      <br />
      <label>
        Desde:
        <input type="date" />
      </label>
      <br />
      <br />
      <label>
        Hasta:
        <input type="date" />
      </label>
      <br />
      <br />
      <label>
        Asiento:
        <input type="text" />
      </label>
      <br />
      <br />
      <label>
        Precio:
        <input type="number" />
      </label>
      <br />
      <br />
      <button type="button">Encontrar Asiento</button>
      <button type="button">Comprar Boleto</button>
    </form>
  );
};
