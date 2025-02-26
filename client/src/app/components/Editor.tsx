import React, { useCallback, useEffect, useState } from 'react';
import 'quill/dist/quill.snow.css';
import Quill, { Delta } from 'quill';
import { io } from 'socket.io-client';
import { useParams, useRouter } from 'next/navigation';
import { TOOLBAR_OPTIONS } from '../configs/editor';
import { useAuthStore } from '../store/useAuthStore';
import Toast from './Toast';
import DocumentNameInput from './DocumentNameInput';

const SAVE_INTERVAL_MS = 10000;
interface WrapperRef {
  (wrapper: HTMLDivElement | null): void;
}

const Editor = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [quill, setQuill] = useState<Quill | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { id: documentId } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const _socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      transports: ['websocket', 'polling'],
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const receiveChangesHandler = (delta: Delta) => {
      quill.updateContents(delta);
    };

    socket.on('receive-changes', receiveChangesHandler);

    return () => {
      socket.off('receive-changes', receiveChangesHandler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once('load-document', document => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit('get-document', [documentId, user?.id]);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('save-document', documentId);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  // Add WebSocket error event listener
  useEffect(() => {
    if (!socket) return;

    const errorHandler = ({ message, redirect }: { message: string; redirect: boolean }) => {
      console.error('WebSocket error:', message);
      setToastMessage({ message, type: 'error' });
      setShowToast(true);
      if (redirect) {
        setTimeout(() => {
          router.push('/documents');
        }, 3000);
      }
    };

    socket.on('error', errorHandler);

    return () => {
      socket.off('error', errorHandler);
    };
  }, [socket, router, setShowToast]);

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
    <div className='relative p-4'>
      {showToast && toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setShowToast(false)} />
      )}
      <div className="my-2">
        <DocumentNameInput />
      </div>
      <div ref={wrapperRef} className='editor-container w-full'></div>
    </div>
  );
};

export default Editor;