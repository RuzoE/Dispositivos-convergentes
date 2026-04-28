import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSensorData } from '../../hooks/useSensorData';
import Colors from '../../constants/Colors';
import { AlertItem } from '../../components/AlertItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AlertsScreen() {
  const { alerts, loading, refreshData } = useSensorData();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} tintColor={Colors.dark.tint} />
      }
    >
      {alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="bell-check" size={48} color={Colors.dark.success} style={{ marginBottom: 16 }} />
          <Text style={styles.emptyText}>Todo en orden.</Text>
          <Text style={styles.emptySubtext}>No se han detectado alertas recientemente.</Text>
        </View>
      ) : (
        alerts.map(alert => (
          <AlertItem key={alert.id} alert={alert} />
        ))
      )}
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
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  }
});
