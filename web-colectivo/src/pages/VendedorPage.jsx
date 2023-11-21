import { Visible } from "../context/RequireAuth";

export const VendedorPage = () => {
  return (
    <>
      <p>Pagina de Vendedores</p>
      <Visible rol="admin">
        <p>Es admin!</p>
      </Visible>
      <Visible rol="user">
        <p>
          Es Vendedor!, tu no puedes ver nada de esta pagina porque es solo para
          Admins!
        </p>
      </Visible>
    </>
  );
};
