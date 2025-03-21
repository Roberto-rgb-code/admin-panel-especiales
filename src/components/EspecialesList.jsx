// admin-panel-especiales/src/components/EspecialesList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EspecialesList.css';

const EspecialesList = () => {
  const [especiales, setEspeciales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_ESPECIALES_API_URL;

  useEffect(() => {
    fetchEspeciales();
  }, []);

  const fetchEspeciales = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/especiales-destacados`, {
        headers: { 'Accept': 'application/json' },
      });
      setEspeciales(response.data);
    } catch (error) {
      setError('Error al obtener especiales: ' + error.message);
      console.error('Error al obtener especiales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este especial?')) {
      try {
        await axios.delete(`${apiUrl}/api/especiales-destacados/${id}`);
        fetchEspeciales();
      } catch (error) {
        setError('Error al eliminar el especial: ' + error.message);
        console.error('Error al eliminar el especial:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 text-red-600">
          <p className="text-xl mb-2">{error}</p>
          <button onClick={() => fetchEspeciales()} className="mt-4 btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Administrar Especiales Destacados</h1>
      <Link to="/nuevo" className="btn btn-primary">Agregar Especial</Link>
      {especiales.length === 0 ? (
        <p>No hay especiales registrados.</p>
      ) : (
        <div className="especiales-grid">
          {especiales.map((especial) => (
            <div key={especial.id} className="especial-card">
              <div className="especial-images">
                {especial.fotos && especial.fotos.length > 0 ? (
                  <img
                    src={`${apiUrl}/storage/${especial.fotos[0].foto_path}`}
                    alt={especial.nombre}
                    className="especial-image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+image';
                    }}
                  />
                ) : especial.foto_path ? (
                  <img
                    src={`${apiUrl}/storage/${especial.foto_path}`}
                    alt={especial.nombre}
                    className="especial-image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+image';
                    }}
                  />
                ) : (
                  <div className="especial-image placeholder">No hay foto</div>
                )}
              </div>
              <div className="especial-content">
                <h3>{especial.nombre}</h3>
                <p>{especial.descripcion}</p>
                <p>Categoría: {especial.categoria}</p>
                <div className="especial-actions">
                  <Link to={`/editar/${especial.id}`} className="btn btn-primary-small">Editar</Link>
                  <button className="btn btn-secondary-small" onClick={() => handleDelete(especial.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EspecialesList;