const mqtt = require('mqtt')
const readline = require('readline')

const protocol = 'mqtt'
const host = '184.72.206.210'
const port = '1883'
const clientId = `mqtt_publisher_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'Marel',
  password: '1234',
  reconnectPeriod: 1000,
})

const publishTopic = 'publicador'
const subscribeTopic = 'suscriptor'

client.on('connect', () => {
  console.log('Connected to MQTT broker')
  client.subscribe(publishTopic, () => {
    console.log(`Subscribed to topic '${publishTopic}'`)
    console.log('Type your message and press Enter to send. Type "exit" to quit.')
    askForInput()
  })
})

client.on('message', (topic, payload) => {
  console.log(`Received message on ${topic}: ${payload.toString()}`)
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askForInput() {
  rl.question('', (message) => {
    if (message.toLowerCase() === 'exit') {
      client.end()
      rl.close()
      console.log('Disconnected from MQTT broker')
      process.exit(0)
    } else {
      client.publish(subscribeTopic, message, (error) => {
        if (error) {
          console.error('Error publishing message:', error)
        } else {
          console.log(`Message sent to ${subscribeTopic}`)
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