const express = require('express');
const https = require('https');

const fs = require('fs');
const WebSocket = require('ws');


const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = https.createServer({
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('cert.pem')
}, (req, res) => {
  res.writeHead(200);
  res.end("HTTPS server is running");
});
const wss = new WebSocket.Server({ server });


// let clients = []; // สำหรับเก็บ client ที่เชื่อมต่ออยู่


app.get('/test', (req, res) => {
  return res.status(200).json({
    message: 'Hello, World!',
    status: 'success'
  })
});



wss.on('connection', (ws) => {
  console.log('Client connected to ws.yourdomain.com');
  ws.send(JSON.stringify({ msg: 'เชื่อมต่อสำเร็จ!' }));
});

// รับการเชื่อมต่อจาก Frontend
// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   clients.push(ws);

//   ws.on('close', () => {
//     clients = clients.filter(client => client !== ws);
//   });
// });

// รับ API POST จาก CodeIgniter
app.post('/new-order', (req, res) => {
  //const order = req.body;
  console.log('รับออเดอร์จาก CI4');
  // ส่งต่อไปยังทุก client ที่เชื่อมต่ออยู่
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'new-order'
      }));
    }
  });

  res.json({ status: 'sent to clients' });
});


server.listen(443, () => {
  console.log('✅ WebSocket server running on port 4001');
});
