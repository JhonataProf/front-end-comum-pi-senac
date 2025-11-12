import React from "react";
import adicionarPrato from "../assets/imagem_adicionar_prato.jpg";
import { Link } from "react-router-dom";
import "../estilos/CardNovoPrato.css";

const CardNovoPrato = () => {

  const meuTitulo = "Clique aqui para adicionar um novo prato";
  return (
    <Link to="/cadastro-prato" className="link-card">
      <div className="prato-card">
        <img src={adicionarPrato} alt="Imagem do prato" />
        <h2>{meuTitulo}</h2>
      </div>
    </Link>
  );
};

export default CardNovoPrato;
