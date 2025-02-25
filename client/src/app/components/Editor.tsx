'use client'

import React, { useCallback, useEffect, useState } from 'react'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { io } from 'socket.io-client'
import { TOOLBAR_OPTIONS } from '../configs/editor';

interface WrapperRef {
  (wrapper: HTMLDivElement | null): void;
}

const Editor = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [quill, setQuill] = useState<Quill | undefined>(undefined);

  useEffect(() => {
    const _socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      transports: ['websocket', 'polling'],
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
    }
  }, []);

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


  return (
    <div ref={wrapperRef} className='editor-container w-full'></div>
  )
}

export default Editor