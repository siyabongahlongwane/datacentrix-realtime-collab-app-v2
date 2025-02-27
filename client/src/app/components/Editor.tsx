import React, { useCallback, useEffect, useState } from 'react';
import 'quill/dist/quill.snow.css';
import Quill, { Delta } from 'quill';
import { io } from 'socket.io-client';
import { useParams } from 'next/navigation';
import { TOOLBAR_OPTIONS } from '../configs/editor';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import DocumentNameInput from './DocumentNameInput';
import { useToastStore } from '../store/useToastStore';

const SAVE_INTERVAL_MS = 10000;
interface WrapperRef {
  (wrapper: HTMLDivElement | null): void;
}

const Editor = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [quill, setQuill] = useState<Quill | undefined>(undefined);
  const { id: documentId } = useParams();
  const { user, logout, access_token } = useAuthStore();
  const router = useRouter();
  const [documentName, setDocumentName] = useState('Untitled Document');
  const { toggleToast } = useToastStore();
  const [disableInput, setDisableInput] = useState(false);

  useEffect(() => {
    const _socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      transports: ['websocket', 'polling'],
      auth: { token: access_token },
      query: {
        documentId,
      }
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
    };
  }, [access_token, documentId]);

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
      setDocumentName(document.title);
      quill.setContents(document.ops);
      if (document.role == 'Viewer') {
        setDisableInput(true);
        quill.disable();
        return;
      }

      quill.enable();
    });

    socket.emit('get-document', [documentId, user?.id]);
  }, [socket, quill, documentId, user?.id]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('save-document', documentId);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  const errorHandler = useCallback(({ message, redirect, clearData }: { message: string, redirect?: boolean, clearData?: boolean }) => {
    console.error('WebSocket error:', message);
    toggleToast({ message, type: 'error', open: true });

    if (clearData) {
      quill?.disable();
      logout();
      router.push('/login');
    }

    if (redirect) {
      router.push('/documents');
    }
  }, [quill, logout, router, toggleToast]);

  useEffect(() => {
    if (!socket) return;

    socket?.on('error', errorHandler);

    return () => {
      socket?.off('error', errorHandler);
    };
  }, [socket, router, logout, quill, errorHandler]);

  useEffect(() => {
    if (!socket) return;

    const documentTitleUpdatedHandler = ({ title }: { title: string }) => {
      setDocumentName(title);
    };

    socket.on('document-title-updated', documentTitleUpdatedHandler);

    return () => {
      socket.off('document-title-updated', documentTitleUpdatedHandler);
    };
  }, [socket]);

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

  const handleUpdateFileName = (newFileName: string) => {
    setDocumentName(newFileName);
    socket?.emit('update-document-title', { documentId, title: newFileName });
  };

  return (
    <div className='relative p-4'>
      <div className="pb-4">
        <DocumentNameInput
          documentName={documentName}
          documentId={documentId as string}
          onUpdateFileName={handleUpdateFileName}
          disabled={disableInput}
        />
      </div>
      <div ref={wrapperRef} className='editor-container w-full'></div>
    </div>
  );
};

export default Editor;