import { useState, useEffect } from 'react';

const isEmulator = true; // Cambiar a false si no estás en emulador
const API_BASE = isEmulator ? 'http://10.0.2.2:8000/api' : 'http://10.142.239.120:8000/api';
const API_ULTRASONICO = `${API_BASE}/datos/ultrasonico`;
const API_LUZ = `${API_BASE}/datos/luz`;

export const useSensorData = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      console.log('Iniciando fetch de datos...');
      console.log('Endpoint ultrasónico:', API_ULTRASONICO);
      console.log('Endpoint luz:', API_LUZ);

      // Obtener datos de ambos sensores en paralelo
      const [resUltrasonico, resLuz] = await Promise.all([
        fetch(API_ULTRASONICO),
        fetch(API_LUZ)
      ]);
      
      if (!resUltrasonico.ok || !resLuz.ok) {
        throw new Error('Error al obtener datos de sensores');
      }
      
      try {
        const jsonUltrasonico = await resUltrasonico.text();
        const jsonLuz = await resLuz.text();

        let dataUltrasonico = JSON.parse(jsonUltrasonico);
        let dataLuz = JSON.parse(jsonLuz);

        console.log('Datos recibidos de ultrasónico:', dataUltrasonico);
        console.log('Datos recibidos de luz:', dataLuz);

        if (!Array.isArray(dataUltrasonico) || !Array.isArray(dataLuz)) {
          throw new Error('Los datos recibidos no son arrays válidos');
        }

        dataUltrasonico = Array.isArray(dataUltrasonico) ? dataUltrasonico : [];
        dataLuz = Array.isArray(dataLuz) ? dataLuz : [];

        const maxLength = Math.max(dataUltrasonico.length, dataLuz.length);
        const combinedData = [];

        for (let i = 0; i < maxLength; i++) {
          const ultraItem = dataUltrasonico[i] || {};
          const luzItem = dataLuz[i] || {};

          const fecha = ultraItem.fecha || ultraItem.created_at || ultraItem.timestamp || 
                       luzItem.fecha || luzItem.created_at || luzItem.timestamp || 
                       new Date().toISOString();

          combinedData.push({
            id: ultraItem.id || luzItem.id || i,
            distancia: parseFloat(ultraItem.valor || ultraItem.distancia || 0),
            luz: parseFloat(luzItem.valor || luzItem.luz || 0),
            fecha: fecha,
          });
        }

        combinedData.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        setData(combinedData);
        setError(null);
        setIsOnline(true);
      } catch (err) {
        console.error('Error al analizar JSON:', err);
        setError('Error al analizar los datos del servidor.');
        setIsOnline(false);
      }
    } catch (err) {
      setError(err.message);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    fetchData();
  };

  return { data, loading, error, isOnline, refreshData };
};

export const processChartData = (data, key) => {
  if (!data || data.length === 0) return { labels: [], datasets: [{ data: [0] }] };

  // Tomar últimos 20 datos para mejor visualización
  const recentData = data.slice(-20);
  
  // Crear labels con tiempo
  const labels = recentData.map(item => {
    const date = new Date(item.fecha);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  });
  
  // Convertir valores a números
  const values = recentData.map(item => {
    const val = parseFloat(item[key]);
    return isNaN(val) ? 0 : val;
  });

  return {
    labels,
    datasets: [{
      data: values,
      color: (opacity = 1) => `rgba(187, 134, 252, ${opacity})`,
      strokeWidth: 3,
      linejoinType: "round",
    }],
  };
};
