import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:3000')

function connect(event, cb) {
  socket.on(event, (message) => {
    console.log("RECEIVED", event, message)
    cb(message);
  })
}

function emit(event, data) {
  socket.emit(event, data)
}

export { connect, emit }