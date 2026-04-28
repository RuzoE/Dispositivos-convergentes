import { useState, useEffect, useCallback } from 'react';
import { SensorData, AlertEvent } from '../types';
import { supabase } from '../constants/Supabase';

// Límites para las alertas
const DISTANCIA_MIN = 20; // cm
const LUZ_MAX = 800; // lux

export const useSensorData = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: mediciones, error: supabaseError } = await supabase
        .from('mediciones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (mediciones) {
        // Aseguramos que los datos estén ordenados cronológicamente (antiguos a recientes para la gráfica)
        const sortedData = [...mediciones].reverse();

        setData(sortedData);
        setError(null);
        setIsOnline(true);
        
        // Chequear por alertas con el dato más reciente
        if (mediciones.length > 0) {
          const latest = mediciones[0]; // El primer elemento es el más reciente por order.desc
          checkAlerts(latest);
        }
      }

    } catch (err: any) {
      console.error('Error fetching Supabase data:', err);
      if (err.message === 'Network request failed') {
        setError('Error de red: Tu celular o emulador no tiene acceso a internet para contactar a Supabase. Verifica tu conexión Wi-Fi.');
      } else {
        setError(err.message || 'Error al conectar con Supabase.');
      }
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAlerts = (latestData: SensorData) => {
    const newAlerts: AlertEvent[] = [];
    const timestamp = latestData.created_at || new Date().toISOString();
    
    // Generar un ID único basado en timestamp
    if (latestData.distancia < DISTANCIA_MIN) {
      newAlerts.push({
        id: `dist-${timestamp}`,
        type: 'distancia',
        value: latestData.distancia,
        threshold: DISTANCIA_MIN,
        message: `¡Alerta! Distancia muy corta (${latestData.distancia} cm). Mínimo permitido: ${DISTANCIA_MIN} cm.`,
        timestamp,
      });
    }

    if (latestData.lux > LUZ_MAX) {
      newAlerts.push({
        id: `lux-${timestamp}`,
        type: 'luz',
        value: latestData.lux,
        threshold: LUZ_MAX,
        message: `¡Alerta! Nivel de luz alto (${latestData.lux} lux). Máximo permitido: ${LUZ_MAX} lux.`,
        timestamp,
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prevAlerts => {
        // Combinar y evitar duplicados exactos usando el ID
        const combined = [...newAlerts, ...prevAlerts];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        // Mantener solo las últimas 20 alertas
        return unique.slice(0, 20);
      });
    }
  };

  useEffect(() => {
    fetchData();
    // Polling cada 5 segundos para mantener actualizado
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const refreshData = () => {
    fetchData();
  };

  return { data, loading, error, isOnline, refreshData, alerts };
};
