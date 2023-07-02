import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';

const port = process.env.PORT || 4000;

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    request.on('error', (err) => {
        console.error(err);
        response.statusCode = 400;
        response.end();
      });
      response.on('error', (err) => {
        console.error(err);
      });
      if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
      } else {
        response.statusCode = 404;
        response.end();
      }
});

async function startApp() {
    try{
        server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
      });
    } catch (err) {
      console.log(err);
    }
  }
  
  startApp();