import { serverHttp } from "./http";
import './websocket.ts';

serverHttp.listen(3001, ()=>console.log('server is running')); 