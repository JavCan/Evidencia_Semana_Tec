const mqtt = require('mqtt')
const readline = require('readline')

const protocol = 'mqtt'
const host = '184.72.206.210'
const port = '1883'
const clientId = `mqtt_subscriber_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'Marel',
  password: '1234',
  reconnectPeriod: 1000,
})

const subscribeTopic = 'suscriptor'
const publishTopic = 'publicador'

let username = '';

function getUser() {
  return new Promise((resolve) => {
    rl.question('Por favor, ingresa tu nombre de usuario: ', (answer) => {
      resolve(answer);
    });
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

client.on('connect', async () => {
  console.log('Connected to MQTT broker')
  username = await getUser();
  client.subscribe(subscribeTopic, () => {
    console.log(`Subscribed to topic '${subscribeTopic}'`)
    console.log('Type your message and press Enter to send. Type "exit" to quit.')
    askForInput()
  })
})

client.on('message', (topic, payload) => {
  console.log(`${payload.toString()}`)
  askForInput()
})

function askForInput() {
  rl.question('', (message) => {
    if (message.toLowerCase() === 'exit') {
      client.end()
      rl.close()
      console.log('Disconnected from MQTT broker')
      process.exit(0)
    } else {
      client.publish(publishTopic, `${username}: ${message}`, (error) => {
        if (error) {
          console.error('Error publishing message:', error)
        }
      })
      askForInput()
    }
  })
}

client.on('error', (error) => {
  console.error('Connection error:', error)
})

process.on('SIGINT', () => {
  client.end()
  rl.close()
  console.log('Disconnected from MQTT broker')
  process.exit(0)
})