import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSensorData } from '../../hooks/useSensorData';
import Colors from '../../constants/Colors';
import { Chart } from '../../components/Chart';

export default function ChartsScreen() {
  const { data, loading, refreshData } = useSensorData();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} tintColor={Colors.dark.tint} />
      }
    >
      <Chart 
        data={data} 
        dataKey="distancia" 
        title="Historial de Distancia (cm)" 
        color={Colors.dark.tint} 
      />
      
      <Chart 
        data={data} 
        dataKey="lux" 
        title="Historial de Luz (lux)" 
        color={Colors.dark.warning} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    padding: 16,
  }
});
