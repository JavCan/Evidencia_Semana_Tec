const mqtt = require('mqtt')  // Importa la librería MQTT para conectar y comunicarse con el broker
const readline = require('readline')  // Importa readline para recibir entrada desde la consola

// Configuración del protocolo, host, puerto y generación de un ID único para el cliente MQTT
const protocol = 'mqtt'
const host = '34.239.108.228'
const port = '1883'
const clientId = `mqtt_subscriber_${Math.random().toString(16).slice(3)}`  // Genera un ID único para cada cliente

// URL de conexión completa al broker MQTT
const connectUrl = `${protocol}://${host}:${port}`

// Crea una instancia del cliente MQTT con las credenciales y opciones de configuración
const client = mqtt.connect(connectUrl, {
  clientId,  // Identificador del cliente
  clean: true,  // Indica que la sesión debe ser "limpia" (sin guardar estado anterior)
  connectTimeout: 4000,  // Tiempo máximo para intentar conectar (4 segundos)
  username: 'Marel',  // Nombre de usuario para la autenticación
  password: '1234',  // Contraseña para la autenticación
  reconnectPeriod: 1000,  // Intenta reconectar cada segundo si se pierde la conexión
})

// Definición de los tópicos para suscribirse y publicar mensajes
const subscribeTopic = 'suscriptor'
const publishTopic = 'publicador'

let username = '';  // Variable para almacenar el nombre de usuario

// Función para obtener el nombre de usuario mediante una promesa (entrada desde la consola)
function getUser() {
  return new Promise((resolve) => {
    rl.question('Por favor, ingresa tu nombre de usuario: ', (answer) => {
      resolve(answer);  // Resuelve la promesa con la entrada del usuario
    });
  });
}

// Configuración de la interfaz de lectura/escritura desde la consola
const rl = readline.createInterface({
  input: process.stdin,  // Entrada estándar (teclado)
  output: process.stdout  // Salida estándar (consola)
})

// Evento que se dispara al conectar exitosamente al broker MQTT
client.on('connect', async () => {
  console.log('Connected to MQTT broker')  // Muestra un mensaje indicando la conexión
  username = await getUser();  // Solicita al usuario su nombre antes de suscribirse
  client.subscribe(subscribeTopic, () => {
    // Se suscribe al tópico especificado y muestra un mensaje de confirmación
    console.log(`Subscribed to topic '${subscribeTopic}'`)
    console.log('Type your message and press Enter to send. Type "exit" to quit.')
    askForInput()  // Llama a la función para que el usuario pueda escribir mensajes
  })
})

// Evento que se dispara cuando se recibe un mensaje en el tópico suscrito
client.on('message', (topic, payload) => {
  console.log(`${payload.toString()}`)  // Imprime el mensaje recibido
  askForInput()  // Solicita al usuario un nuevo mensaje
})

// Función para solicitar mensajes desde la consola y publicarlos en el broker MQTT
function askForInput() {
  rl.question('', (message) => {
    if (message.toLowerCase() === 'exit') {
      // Si el usuario escribe "exit", se desconecta del broker y cierra la aplicación
      client.end()  // Finaliza la conexión MQTT
      rl.close()  // Cierra la interfaz de readline
      console.log('Disconnected from MQTT broker')
      process.exit(0)  // Sale del proceso
    } else {
      // Publica el mensaje en el tópico correspondiente, junto con el nombre del usuario
      client.publish(publishTopic, `${username}: ${message}`, (error) => {
        if (error) {
          console.error('Error publishing message:', error)  // Maneja cualquier error en la publicación
        }
      })
      askForInput()  // Vuelve a solicitar un nuevo mensaje
    }
  })
}

// Maneja los errores de conexión con el broker MQTT
client.on('error', (error) => {
  console.error('Connection error:', error)  // Muestra el error en consola
})

// Captura la señal de interrupción (Ctrl+C) para cerrar correctamente la conexión y salir del programa
process.on('SIGINT', () => {
  client.end()  // Finaliza la conexión MQTT
  rl.close()  // Cierra la interfaz de readline
  console.log('Disconnected from MQTT broker')
  process.exit(0)  // Sale del proceso
})
