import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSensorData, processChartData } from '../js/homeLogic';
import { homeStyles } from '../css/homeStyles';

const screenWidth = Dimensions.get('window').width;

// Definimos el tipo para los datos del sensor
interface SensorData {
  distancia: number;
  luz: number;
}

const HomeScreen = () => {
  const { data, loading, error, isOnline, refreshData } = useSensorData();

  // Aseguramos que data sea un arreglo de SensorData
  const latestData: SensorData | null = data.length > 0 ? data[data.length - 1] : null;

  useEffect(() => {
    const interval = setInterval(refreshData, 3000); // Actualizar cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    backgroundColor: '#1E1E1E',
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#1E1E1E',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#BB86FC',
      fill: '#BB86FC',
    },
    propsForBackgroundLines: {
      strokeDasharray: '0',
      stroke: '#444444',
      strokeWidth: 1,
    },
  };

  if (loading && data.length === 0) {
    return (
      <View style={homeStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={homeStyles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.title}>Dashboard de Sensores</Text>
        <Text style={[homeStyles.connectionIndicator, { color: isOnline ? '#4CAF50' : '#FF6B6B' }]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>

      {error && (
        <Text style={homeStyles.errorText}>Error: {error}</Text>
      )}

      {latestData ? (
        <>
          <View style={homeStyles.card}>
            <Text style={homeStyles.cardTitle}>📏 Distancia Actual</Text>
            <Text style={homeStyles.value}>{latestData.distancia} cm</Text>
          </View>

          <View style={homeStyles.card}>
            <Text style={homeStyles.cardTitle}>💡 Luz Actual</Text>
            <Text style={homeStyles.value}>{latestData.luz} lux</Text>
          </View>

          <View style={homeStyles.card}>
            <Text style={homeStyles.cardTitle}>📊 Gráfica de Distancia</Text>
            <LineChart
              data={processChartData(data, 'distancia')}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={homeStyles.chartContainer}
            />
          </View>

          <View style={homeStyles.card}>
            <Text style={homeStyles.cardTitle}>📊 Gráfica de Luz</Text>
            <LineChart
              data={processChartData(data, 'luz')}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={homeStyles.chartContainer}
            />
          </View>
        </>
      ) : (
        <Text style={homeStyles.noDataText}>No hay datos disponibles</Text>
      )}

      <TouchableOpacity style={homeStyles.refreshButton} onPress={refreshData}>
        <Text style={homeStyles.refreshButtonText}>Refrescar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;
