// Importa React y los hooks useState y useRef para manejar estado y referencias
import React, { useState, useRef } from "react";

// Importa componentes de interfaz de usuario de :contentReference[oaicite:0]{index=0}
import {
  View,                // Contenedor visual similar a un div en web
  Text,                // Permite mostrar texto
  TextInput,           // Campo donde el usuario escribe información
  TouchableOpacity,    // Botón táctil
  StyleSheet,          // Permite crear estilos
  Alert,               // Muestra alertas emergentes
  ActivityIndicator,   // Indicador de carga (spinner)
  ScrollView,          // Permite desplazarse si el contenido es grande
  KeyboardAvoidingView,// Ajusta la vista cuando aparece el teclado
  Platform,            // Detecta si es Android o iOS
  Modal,               // Ventana emergente
  Animated,            // Permite crear animaciones
} from "react-native";

// Importa la función que conecta con el backend en :contentReference[oaicite:1]{index=1}
import { registrarUsuario } from "../services/usuariosApi";

// Componente principal de registro
export default function Registro() {

  // Estado que controla si se muestra o no la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Estado que controla el indicador de carga
  const [cargando, setCargando] = useState(false);

  // Controla si el modal de éxito está visible
  const [modalVisible, setModalVisible] = useState(false);

  // Guarda el nombre del usuario registrado para mostrarlo en el modal
  const [nombreRegistrado, setNombreRegistrado] = useState("");

  // Animación para el tamaño del modal
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Animación para mostrar el check de éxito
  const checkAnim = useRef(new Animated.Value(0)).current;

  // Estado que guarda todos los datos del formulario
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
  });

  // Función que actualiza los campos del formulario
  const actualizar = (campo: string, valor: string) => {
    setForm({ ...form, [campo]: valor });
  };

  // Función que valida los datos antes de enviarlos al servidor
  const validar = () => {
    if (!form.nombre) return Alert.alert("Error", "Nombre requerido");
    if (!form.apellido) return Alert.alert("Error", "Apellido requerido");
    if (!form.email) return Alert.alert("Error", "Email requerido");
    if (!form.telefono) return Alert.alert("Error", "Telefono requerido");

    // Valida que la contraseña tenga mínimo 6 caracteres
    if (form.password.length < 6)
      return Alert.alert("Error", "Minimo 6 caracteres");

    // Verifica que ambas contraseñas coincidan
    if (form.password !== form.confirmarPassword)
      return Alert.alert("Error", "Las contraseñas no coinciden");

    return true;
  };

  // Función que muestra el modal de éxito con animación
  const mostrarModalExito = (nombre: string) => {

    // Guarda el nombre del usuario
    setNombreRegistrado(nombre);

    // Muestra el modal
    setModalVisible(true);

    // Reinicia las animaciones
    scaleAnim.setValue(0);
    checkAnim.setValue(0);

    // Secuencia de animaciones
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  // Función que envía los datos al backend
  const enviar = async () => {

    // Primero valida los datos
    if (!validar()) return;

    // Activa el indicador de carga
    setCargando(true);

    try {

      // Envía los datos al backend (Laravel API)
      const usuario = await registrarUsuario(form);

      // Muestra el modal de éxito
      mostrarModalExito(usuario.nombre);

      // Limpia el formulario
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        password: "",
        confirmarPassword: "",
      });

    } catch (error: any) {

      // Si ocurre un error lo muestra
      Alert.alert("Error", error.message);

    }

    // Desactiva el indicador de carga
    setCargando(false);
  };  
  
  // Renderiza la interfaz
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>
            Completa tus datos para registrarte
          </Text>
        </View>

        {/* Card del formulario */}
        <View style={styles.card}>
          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nombre"
                placeholderTextColor="#94A3B8"
                value={form.nombre}
                onChangeText={(v) => actualizar("nombre", v)}
              />
            </View>
          </View>

          {/* Apellido */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu apellido"
                placeholderTextColor="#94A3B8"
                value={form.apellido}
                onChangeText={(v) => actualizar("apellido", v)}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#94A3B8"
                value={form.email}
                onChangeText={(v) => actualizar("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Telefono */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu número de teléfono"
                placeholderTextColor="#94A3B8"
                value={form.telefono}
                onChangeText={(v) => actualizar("telefono", v)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#94A3B8"
                value={form.password}
                onChangeText={(v) => actualizar("password", v)}
                secureTextEntry={!mostrarPassword}
              />
              <TouchableOpacity
                onPress={() => setMostrarPassword(!mostrarPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.ver}>
                  {mostrarPassword ? "🙈" : "👁"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#94A3B8"
                value={form.confirmarPassword}
                onChangeText={(v) => actualizar("confirmarPassword", v)}
                secureTextEntry={!mostrarPassword}
              />
            </View>
          </View>

          {/* Botón */}
          <TouchableOpacity
            style={[styles.boton, cargando && styles.botonDisabled]}
            onPress={enviar}
            disabled={cargando}
            activeOpacity={0.8}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.textoBoton}>Crear cuenta</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de éxito */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Animated.View
              style={[styles.successCircle, { opacity: checkAnim }]}
            >
              <Text style={styles.successCheck}>✓</Text>
            </Animated.View>

            <Text style={styles.modalTitle}>¡Registro exitoso!</Text>
            <Text style={styles.modalMessage}>
              Bienvenido/a{"\n"}
              <Text style={styles.modalName}>{nombreRegistrado}</Text>
            </Text>
            <Text style={styles.modalSub}>
              Tu cuenta ha sido creada correctamente
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={cerrarModal}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Continuar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1E293B",
    borderWidth: 2,
    borderColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  iconText: {
    fontSize: 32,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  subtitulo: {
    fontSize: 15,
    color: "#94A3B8",
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#334155",
    paddingHorizontal: 12,
  },

  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#F1F5F9",
  },

  eyeButton: {
    padding: 8,
  },

  ver: {
    fontSize: 18,
  },

  boton: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  botonDisabled: {
    opacity: 0.7,
  },

  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },

  /* ── Modal de éxito ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  modalContent: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: "#334155",
  },

  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },

  successCheck: {
    fontSize: 40,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 16,
    color: "#CBD5E1",
    textAlign: "center",
    lineHeight: 24,
  },

  modalName: {
    color: "#6366F1",
    fontWeight: "700",
    fontSize: 18,
  },

  modalSub: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 24,
  },

  modalButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});