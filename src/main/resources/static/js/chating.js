import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// ES 모듈에서 __dirname을 사용하는 방법
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const port = 3000;

// CORS 미들웨어 설정
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    // credentials: true
}));

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '../static')));

// 기본 경로 '/'로 요청 시 chating.html 파일 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../templates/chating/chating_index.html')); // templates/chating.html
});

// 클라이언트 연결 시 처리
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// 서버 시작
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
