const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// รายการ domain ที่อนุญาต
// const allowedOrigins = [
//   'https://watershop25.tsmiledev.com',
//   'https://tsmiledev.com'
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // ถ้าไม่มี origin (เช่น curl, postman) หรือ origin อยู่ใน whitelist
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://tsmiledev.com",
      "https://watershop25.tsmiledev.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
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
