import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useSensorData } from '../../hooks/useSensorData';
import Colors from '../../constants/Colors';
import { Card } from '../../components/Card';

export default function DashboardScreen() {
  const { data, loading, error, isOnline, refreshData } = useSensorData();

  // El dato más reciente es el primero en el arreglo (gracias al ordenamiento)
  const currentData = data.length > 0 ? data[0] : null;

  if (loading && data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
        <Text style={styles.loadingText}>Cargando mediciones...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} tintColor={Colors.dark.tint} />
      }
    >
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? Colors.dark.success : Colors.dark.danger }]} />
          <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
        <Text style={styles.subtitle}>
          Última actualización: {currentData ? new Date(currentData.created_at).toLocaleTimeString() : '--:--'}
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && data.length === 0 && !error && (
        <View style={[styles.errorContainer, { backgroundColor: `${Colors.dark.warning}20`, borderLeftColor: Colors.dark.warning }]}>
          <Text style={[styles.errorText, { color: Colors.dark.warning }]}>
            Conexión exitosa, pero la tabla "mediciones" en Supabase está vacía. ¡Envía datos desde tu ESP32/Sensor!
          </Text>
        </View>
      )}

      {/* Cards de Sensores */}
      <View style={styles.cardsContainer}>
        <Card
          title="Distancia Actual"
          value={currentData ? currentData.distancia.toFixed(1) : '--'}
          unit="cm"
          icon="ruler"
          color={Colors.dark.tint}
        />
        <Card
          title="Luz Actual"
          value={currentData ? currentData.lux.toFixed(0) : '--'}
          unit="lux"
          icon="white-balance-sunny"
          color={Colors.dark.warning}
        />
      </View>

      {/* Extra Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Resumen</Text>
        <Text style={styles.infoText}>
          Total de mediciones recolectadas: {data.length}
        </Text>
        <Text style={styles.infoText}>
          Límites configurados para alertas: Distancia &lt; 20 cm, Luz &gt; 800 lux.
        </Text>
      </View>

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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.dark.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 12,
  },
  errorContainer: {
    backgroundColor: `${Colors.dark.danger}20`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.danger,
  },
  errorText: {
    color: Colors.dark.danger,
  },
  cardsContainer: {
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  }
});
