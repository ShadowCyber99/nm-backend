import React from 'react';
import { io } from 'socket.io-client';

const apiHost = process.env.REACT_APP_BASE_URL;
export const socket = io(apiHost);
export const SocketContext = React.createContext();
