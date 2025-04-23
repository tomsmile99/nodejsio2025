const express = require('express');
//const http = require('http');
const https = require('https');
const { Server } = require('socket.io');

const fs = require('fs');
// const WebSocket = require('ws');


const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());



// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

//const server = http.createServer(app);
const server = https.createServer({
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('privkey.pem')
}, app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// โหลด SSL certificate (จาก Let's Encrypt หรือใบ cert ของคุณ)
// const server = https.createServer({
//   cert: fs.readFileSync('./ssl/Lets_Encrypt_nodeio25.tsmiledev.com.pem'),
//   key: fs.readFileSync('./ssl/private.key')
// }, app);

// const io = new Server(server, {
//   cors: {
//     origin: 'https://watershop25.tsmiledev.com/', // หรือ '*'
//     methods: ['GET', 'POST']
//   }
// });

//let clients = []; // สำหรับเก็บ client ที่เชื่อมต่ออยู่

// wss.on('connection', (ws,req) => {
//   //console.log('🟢 Admin connected:', ws);
//   console.log('✅ Client connected');

//   // ถ้าอยากดู IP ที่เชื่อมต่อ:
//   const ip = req.socket.remoteAddress;
//   console.log('Client IP:', ip);

//   // ทดสอบส่งข้อความกลับไป
//   ws.send(JSON.stringify({ message: 'คุณเชื่อมต่อสำเร็จแล้ว!' }));

//   // จำลองมี order เข้ามาหลัง 5 วินาที
//   // setTimeout(() => {
//   //   ws.send('new-order'); // ✅ ส่งข้อความไปยัง client
//   // }, 5000);
// });

app.get('/test', (req, res) => {
  return res.status(200).json({
    message: 'Hello, World!',
    status: 'success'
  })
});

// app.post('/new-order', (req, res) => {
//   //const order = req.body;
//   //io.emit('new-order');
//   res.status(200).send('มีการสั่งซื้อเข้ามาใหม่');
//   ws.send('new-order')
// });

// รับการเชื่อมต่อจาก Frontend
// เมื่อ client เชื่อมต่อ
io.on('connection', (socket) => {
  console.log('⚡ มีผู้เชื่อมต่อ:', socket.id);

  // รับข้อความจาก client
  socket.on('chat message', (msg) => {
    console.log('📩 ข้อความที่รับ:', msg);

    // ส่งข้อความกลับไปให้ทุกคน
    io.emit('chat message', msg);
  });

  // เมื่อ client ตัดการเชื่อมต่อ
  socket.on('disconnect', () => {
    console.log('❌ ผู้ใช้ตัดการเชื่อมต่อ:', socket.id);
  });
});

// รับ API POST จาก CodeIgniter
app.post('/new-order', (req, res) => {
  //const order = req.body;
  io.emit('new-order');
  res.status(200).send('Order broadcasted');
});


server.listen(4001, () => {
  console.log('✅ WebSocket server running on port 4001');
});
