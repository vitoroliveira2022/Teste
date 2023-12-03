import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Notificacoes() {
  const [socket, setSocket] = useState();

  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://localhost:3005');

      newSocket.on('novoAnime', (data) => {
        const creatorSocketId = data.creatorSocketId;
        const currentSocketId = newSocket.id;

        if (currentSocketId !== creatorSocketId) {
          toast.success(data.message)
          
        }
      });

      setSocket(newSocket);
    }

    // Cleanup: desconectar o socket quando o componente é desmontado
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}
