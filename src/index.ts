import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import { User } from './types/User';
import { validate, v4 as uuidv4 } from 'uuid';

const port = process.env.PORT || 4000;
let users: User[] = [];
// console.log("users", users);

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  const { method, url } = request;
  // console.log("url", url);
  // console.log("method", method);
  const userId = url.split('/')[3]
  // console.log("userId", userId);

  if(url === '/api/users') {
    if(method === 'GET') {
      console.log(1)
      try{
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ users }));
      } catch (e) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(e.message));
      };
    } else if (method === 'POST') {
      console.log(4)
      try{
        let body = '';
        // console.log('body', body)
        request.on('data', (chunk)=>{body += chunk.toString()});
        request.on('end', () => {
          // console.log('body', body)
          const user = JSON.parse(body);
  
          if (!user.username || !user.age || !user.hobbies ||
            typeof user.username !== 'string' ||
            typeof user.age !== 'number' ||
            !Array.isArray(user.hobbies)) {
              response.writeHead(400, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify('Username, age and hobbies are required'));
          }
  
          const newUser: User = {
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
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(e.message));
      }
    };
  } else if (url === `/api/users/${userId}`){
    if (!validate(userId)) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify('Username is not valid'));
      return;
    }
    users.forEach((el, i)=>{
      if(el.id === userId) {
        if(method === 'GET') {
          console.log(2);
          try{
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(users[i]));
          } catch (e) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(e.message)); 
          };
        } else if(method === 'PUT') {
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
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(e.message));
          };
        } else if (method === 'DELETE') {
          console.log(5);
          try{
            response.writeHead(204, { 'Content-Type': 'application/json' });
            users.splice(i, 1);
            response.end(JSON.stringify(users[i]));
          } catch (e) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(e.message));
          };
        };
      } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify('There is no such user'));
      }
    })
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify('There is no such endpoints'));
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