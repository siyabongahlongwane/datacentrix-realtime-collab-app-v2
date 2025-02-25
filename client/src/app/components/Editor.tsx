import React, { useCallback, useEffect, useState } from 'react';
import 'quill/dist/quill.snow.css';
import Quill, { Delta } from 'quill';
import { io } from 'socket.io-client';
import { useParams } from 'next/navigation';
import { TOOLBAR_OPTIONS } from '../configs/editor';

const SAVE_INTERVAL_MS = 10000;
interface WrapperRef {
  (wrapper: HTMLDivElement | null): void;
}

const Editor = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [quill, setQuill] = useState<Quill | undefined>(undefined);
  const { id: documentId } = useParams();

  useEffect(() => {
    const _socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      transports: ['websocket', 'polling'],
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const textChangeHandler = (delta: Delta, oldDelta: Delta, source: string) => {
      if (source !== 'user') return;
      socket?.emit('send-changes', [documentId, delta]);
    }

    quill.on('text-change', textChangeHandler);
    return () => {
      quill.off('text-change', textChangeHandler);
    }
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const receiveChangesHandler = (delta: Delta) => {
      quill.updateContents(delta);
    }

    socket.on('receive-changes', receiveChangesHandler);

    return () => {
      socket.off('receive-changes', receiveChangesHandler);
    }
  }, [socket, quill]);

  const wrapperRef: WrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const quillInstance = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
    quillInstance.disable();
    quillInstance.setText('Loading Document');
    setQuill(quillInstance);
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once('load-document', document => {
      quill.setContents(document);
      quill.enable();
    })

    socket.emit('get-document', documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('save-document', documentId);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    }
  }, [socket, quill, documentId]);

  return (
    <div ref={wrapperRef} className='editor-container w-full'></div>
  );
}

export default Editor;