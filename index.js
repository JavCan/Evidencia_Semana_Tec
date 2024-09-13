// Import required modules
const mqtt = require('mqtt')  // MQTT client library
const readline = require('readline')  // For reading user input from console

// MQTT broker connection details
const protocol = 'mqtt'
const host = '34.239.108.228'  // IP address of the AWS EC2 instance
const port = '1883'  // Default MQTT port
const clientId = `mqtt_publisher_${Math.random().toString(16).slice(3)}`  // Generate a unique client ID

// Construct the connection URL
const connectUrl = `${protocol}://${host}:${port}`

// Create an MQTT client instance
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,  // Start a clean session
  connectTimeout: 4000,  // Connection timeout in milliseconds
  username: 'Marel',  // Authentication username
  password: '1234',  // Authentication password
  reconnectPeriod: 1000,  // Reconnection interval in milliseconds
})

// Define MQTT topics
const publishTopic = 'publicador'  // Topic to publish messages to
const subscribeTopic = 'suscriptor'  // Topic to subscribe to for receiving messages

// Variable to store the user's name
let username = '';

// Function to get the user's name
function getUser() {
  return new Promise((resolve) => {
    rl.question('Username: ', (answer) => {
      resolve(answer);
    });
  });
}

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Event handler for when the client connects to the MQTT broker
client.on('connect', async () => {
  console.log('Connected to MQTT broker')
  
  // Get the username from the user
  username = await getUser();
  
  // Subscribe to the publish topic
  client.subscribe(publishTopic, () => {
    console.log(`Subscribed to topic '${publishTopic}'`)
    console.log('Type your message and press Enter to send. Type "exit" to quit.')
    askForInput()  // Start asking for user input
  })
})

// Event handler for receiving messages
client.on('message', (topic, payload) => {
  console.log(`${payload.toString()}`)
  askForInput()  // Ask for next input after receiving a message
})

// Function to handle user input
function askForInput() {
  rl.question('', (message) => {
    if (message.toLowerCase() === 'exit') {
      // If user types 'exit', close the connection and quit
      client.end()
      rl.close()
      console.log('Disconnected from MQTT broker')
      process.exit(0)
    } else {
      // Publish the user's message to the subscriber topic
      client.publish(subscribeTopic, `${username}: ${message}`, (error) => {
        if (error) {
          console.error('Error publishing message:', error)
        }
      })
      askForInput()  // Ask for next input
    }
  })
}

// Event handler for connection errors
client.on('error', (error) => {
  console.error('Connection error:', error)
})

// Handle process termination (e.g., Ctrl+C)
process.on('SIGINT', () => {
  client.end()
  rl.close()
  console.log('Disconnected from MQTT broker')
  process.exit(0)
})