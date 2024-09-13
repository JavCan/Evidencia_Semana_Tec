# Evidencia_Semana_Tec

## Project Description

This project demonstrates a real-time chat application using MQTT (Message Queuing Telemetry Transport) protocol. It consists of two Node.js scripts: a publisher (sender) and a subscriber (receiver). The application uses an AWS EC2 instance as the MQTT broker, allowing multiple users to communicate in real-time.

Key features:
- Real-time messaging using MQTT
- AWS EC2 instance as MQTT broker
- Multiple user support
- Simple command-line interface

## Requirements

- Node.js
- npm (Node Package Manager)
- Access to the AWS EC2 instance (IP address, username, and password provided in the code)

## Setup

1. Clone this repository to your local machine.
2. Open a terminal and navigate to the project directory.
3. Install the required packages:
   ```
   npm install mqtt readline
   ```
4. Ensure you have access to the AWS EC2 instance. The instance has a security group with port 1883 open for MQTT communication.

## Usage

### Connecting to the AWS Instance

Before running the scripts, you need to connect to the AWS instance:

```
ssh -i [your-key-file.pem] ec2-user@[EC2-instance-IP]
```

Replace `[your-key-file.pem]` with your AWS key file and `[EC2-instance-IP]` with the actual IP address of the EC2 instance.

### Running the Publisher (Sender)

1. Open a new terminal window.
2. Navigate to the project directory.
3. Run:
   ```
   node publisher.js
   ```
4. Enter your username when prompted.
5. Type your messages and press Enter to send.
6. Type 'exit' to quit.

### Running the Subscriber (Receiver)

1. Open another terminal window.
2. Navigate to the project directory.
3. Run:
   ```
   node subscriber.js
   ```
4. Enter your username when prompted.
5. You will receive messages from other users.
6. You can also type messages to send.
7. Type 'exit' to quit.

## Important Notes

- The AWS EC2 instance serves as the MQTT broker. Its IP address, username, and password are included in the code.
- The publisher sends messages to the 'suscriptor' topic and listens to the 'publicador' topic.
- The subscriber listens to the 'suscriptor' topic and sends messages to the 'publicador' topic.
- Both scripts handle connection errors and provide a way to exit gracefully.

This project was created for Evidencia_Semana_Tec to demonstrate the use of MQTT for real-time communication using an AWS EC2 instance as a broker.