//Faz a requisição das configurações das variáveis locais
require('dotenv').config();

/*
  1. Requisição do next.js para link com o app express
  2. Requisição do express.js
  3. Constante do protocolo http para efetuar a conversa de resposta e requisição com o servidor
*/
const next = require('next');
const express = require("express");
const http = require("http");

/*
  1. Requisição do módulo socket.io
  2. Requisição do método criar cliente da redis, banco de dados em memória
*/
const socket = require("socket.io");
const { createClient } = require('redis');

/*
  1. Constante que estabelece a porta do navegador
  2. Constante que estabelece como modo de produção
*/
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

//Nova instância de um servidor socket.io
const io = new socket.Server();

//Instância que cria o cliente redis e passa a url chave de permissão que vem de uma variável na memória
const redisClient = createClient({
  url: process.env.REDIS_CLIENT
});

/*
  1. Conectando ao app Next
  2. Puxa as propriedades iniciais do app next
*/
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();


nextApp.prepare().then(async () => {
  /*
    1. Instância do app express
    2. Instância do servidor http
    3. Anexamos o servidor http ao servidor socket.io
    4. Instância da resposta json
  */
  const app = express();
  const server = http.createServer(app);
  io.attach(server);

  //app.use(express.json());

  //Mapeia as rotas da api, tornando possível o redirecionamento das rotas
  app.all('*', (req, res) => nextHandler(req, res));


  //Mostra no console se houve erro ao conectar com o Redis banco de dados em memória
  redisClient.on('error', console.error)

  //Espera a promessa da conecção com o redis e retorna o status pelo console
  redisClient.connect()
    .then(() => console.log('Conectado ao Redis '))
    .catch(() => {
      console.error('Falha ao conectar ao Redis')
    })



  /*
  * 1. Funções com o socket conectado.
    2. Pausa a requisição assíncrona para fazer a busca por 
    todos os elementos armazenados na key socket.id, gerada pelo websocket
    3. Estabelece o roomName pelo id da sala
    4. Agora o a sala vai receber as alterações feitas apenas por aquela sala
  */
  io.on('connection', (socket) => {
    socket.on('CODE_CHANGED', async (code) => {
      const { roomId, username } = await redisClient.hGetAll(socket.id)
      const roomName = `ROOM:${roomId}`
      socket.to(roomName).emit('CODE_CHANGED', code)
    })

    socket.on('DISSCONNECT_FROM_ROOM', async ({ roomId, username }) => { })
    /**
     * 1. Consulta ao tamanho da lista de usuários em salas
     * 2. Busca o usuário pelo socket.id
     * 3. Transforma a resposta do banco em uma lista ordenada
     * 4. Estabelece o destino do usuário pelo id
     * 5. Envia o usuário para sala correta
     */
    socket.on('CONNECTED_TO_ROOM', async ({ roomId, username }) => {
      await redisClient.lPush(`${roomId}:users`, `${username}`)
      await redisClient.hSet(socket.id, { roomId, username })

      const users = await redisClient.lRange(`${roomId}:users`, 0, -1)
      const roomName = `ROOM:${roomId}`

      socket.join(roomName)
      socket.to(roomName).emit('ROOM:CONNECTION', users)
    })
  });

  //Porta do servidor
  server.listen(port);
});