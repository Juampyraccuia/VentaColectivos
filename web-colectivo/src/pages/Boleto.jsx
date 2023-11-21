import { Visible } from "../context/RequireAuth";

export const Boleto = () => {
  return (
    <>
      <p>Mi perfil</p>
      <Visible rol="admin">
        <p>Es admin!</p>
      </Visible>
      <Visible rol="user">
        <p>Es usuario!</p>
      </Visible>
    </>
  );
};
