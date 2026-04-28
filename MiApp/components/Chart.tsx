import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '../constants/Colors';
import { SensorData } from '../types';

const screenWidth = Dimensions.get('window').width;

interface ChartProps {
  data: SensorData[];
  dataKey: 'distancia' | 'lux';
  title: string;
  color: string;
}

export const Chart = ({ data, dataKey, title, color }: ChartProps) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay datos disponibles para {title}</Text>
      </View>
    );
  }

  // Tomar los últimos 10 datos para no saturar la gráfica
  const recentData = data.slice(-10);

  const labels = recentData.map(item => {
    const date = new Date(item.created_at);
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  });

  const values = recentData.map(item => item[dataKey]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={screenWidth - 32} // padding horizontal
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: Colors.dark.card,
          backgroundGradientFrom: Colors.dark.card,
          backgroundGradientTo: Colors.dark.card,
          decimalPlaces: 0,
          color: (opacity = 1) => color,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: color,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  }
});
