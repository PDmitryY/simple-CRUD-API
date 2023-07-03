import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import { User } from './types/User';
import { v4 as uuidv4 } from 'uuid';

const port = process.env.PORT || 4000;
let users: User[] = [];
console.log("users", users);

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  const { method, url } = request;
  console.log("url", url);
  console.log("method", method);
  const userId = url.split('/')[3]
  console.log("userId", userId);

  if(!url) throw new Error;
  if(url === '/api/users' && method === 'GET') {
    console.log(1)
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ users }));
  };
  if(url === `/api/users` && method === 'POST') {
    console.log(4)
    try{
      let body = '';
      // console.log('body', body)
      request.on('data', (chunk)=>{body += chunk.toString()});
      request.on('end', () => {
        // console.log('body', body)
        const user = JSON.parse(body);
        const newUser = {
          id: uuidv4(),
          username: user.username,
          age: user.age,
          hobbies: user.hobbies,
        };
        // console.log('newUser', newUser);
        users.push(newUser);
        // console.log('users', users);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(newUser));
      });
    } catch (e) {
      throw new Error(e)
    }
  };
  users.forEach((el, i)=>{
    if(el.id === userId) {
      if(url === `/api/users/${userId}` && method === 'GET') {
        console.log(2);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(users[i]));
      };
      if(url === `/api/users/${userId}` && method === 'PUT') {
        console.log(3);
        try{
          let body = '';
          // console.log('body', body)
          request.on('data', (chunk)=>{body += chunk.toString()});
          request.on('end', () => {
            // console.log('body', body)
            const newData = JSON.parse(body);
            users[i].username = newData.username || users[i].username;
            users[i].age = newData.age || users[i].age;
            users[i].hobbies = newData.hobbies || users[i].hobbies;
            // console.log('newUser', newUser);
            // console.log('users', users);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(users[i]));
          });
        } catch (e) {
          throw new Error(e)
        }
      };
    } 
  })
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