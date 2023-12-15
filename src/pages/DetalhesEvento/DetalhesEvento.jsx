// DetalhesEventoPage.js
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api, { commentaryEventResource, eventsResource } from "../../Services/Service";
import { UserContext } from "../../context/AuthContext";
import Modal from "../../components/Modal/Modal"; 
const DetalhesEventoPage = () => {
  const { idEvento } = useParams();
  const { userData } = useContext(UserContext);
  const [detalhesEvento, setDetalhesEvento] = useState({});
  const [comentarios, setComentarios] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDetalhesEvento = async () => {
      try {
        const response = await api.get(`${eventsResource}/${idEvento}`);
        setDetalhesEvento(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do evento", error);
      }
    };

    const fetchComentarios = async () => {
      try {
        let response;

        if (userData.perfil === "Administrador") {
          // Rota para todos os comentários (perfil de ADM)
          response = await api.get(`${commentaryEventResource}`); // ver se precisa arrumar
        } else {
          // Rota para comentários de IA (perfil comum/público)
          response = await api.get(`${commentaryEventResource}?idEvento=${idEvento}&exibe=true`); // ver se precisa arrumar
        }

        setComentarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar comentários", error);
      }
    };

    fetchDetalhesEvento();
    fetchComentarios();
  }, [idEvento, userData.perfil]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2>{detalhesEvento.titulo}</h2>
      <p>{detalhesEvento.descricao}</p>
      <p>Data do Evento: {detalhesEvento.dataEvento}</p>
      <p>Nome do usuário no feedback: {detalhesEvento.nomeUsuario}</p>

      <button onClick={openModal}>Abrir Detalhes</button>

      <h3>Lista de Feedback</h3>
      <ul>
        {comentarios.map((comentario) => (
          <li key={comentario.idComentarioEvento}>
            <div>
              <p>{comentario.descricao}</p>
              <p>Data do Comentário: {comentario.dataComentario}</p>
              <p>Nome do Usuário: {comentario.nomeUsuario}</p>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <Modal onClose={closeModal}>
          {/* Conteúdo do Modal (Detalhes adicionais do evento) */}
          <h2>Detalhes Adicionais</h2>
          <p>Informações extras sobre o evento...</p>
          <button onClick={closeModal}>X</button>
        </Modal>
      )}
    </div>
  );
};

export default DetalhesEventoPage;
