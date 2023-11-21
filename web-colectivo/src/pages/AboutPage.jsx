import { useParams, useSearchParams } from "react-router-dom";

export const AboutPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("buscar"));
  return (
    <p>
      Acerca de... {id} {searchParams.get("buscar")}
    </p>
  );
};
