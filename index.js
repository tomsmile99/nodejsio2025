const express = require('express');
// const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });

// โหลด SSL certificate (จาก Let's Encrypt หรือใบ cert ของคุณ)
const server = https.createServer({
  cert: fs.readFileSync('./ssl/Lets_Encrypt_nodeio25.tsmiledev.com.pem'),
  key: fs.readFileSync('./ssl/private.key')
}, app);

const io = new Server(server, {
  cors: {
    origin: 'https://watershop25.tsmiledev.com/', // หรือ '*'
    methods: ['GET', 'POST']
  }
});


io.on('connection', (socket) => {
  console.log('🟢 Admin connected:', socket.id);
});

app.get('/test', (req, res) => {
  return res.status(200).json({
    message: 'Hello, World!',
    status: 'success'
  })
});

app.post('/new-order', (req, res) => {
  //const order = req.body;
  io.emit('new-order');
  res.status(200).send('มีการสั่งซื้อเข้ามาใหม่');
});

server.listen(4001, () => {
  console.log('✅ WebSocket server running on port 4001');
});
