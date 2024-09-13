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

client.on('connect', () => {
  console.log('Connected to MQTT broker')
  client.subscribe(subscribeTopic, () => {
    console.log(`Subscribed to topic '${subscribeTopic}'`)
    console.log('Type your message and press Enter to send. Type "exit" to quit.')
    askForInput()
  })
})

client.on('message', (topic, payload) => {
  console.log(`\nPublicador: ${payload.toString()}`)
  askForInput()
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askForInput() {
  rl.question('Suscriptor: ', (message) => {
    if (message.toLowerCase() === 'exit') {
      client.end()
      rl.close()
      console.log('Disconnected from MQTT broker')
      process.exit(0)
    } else {
      client.publish(publishTopic, message, (error) => {
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