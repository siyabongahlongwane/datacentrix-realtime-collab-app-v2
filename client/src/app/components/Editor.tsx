import React, { useCallback, useEffect, useState, useRef } from 'react';
import 'quill/dist/quill.snow.css';
import Quill, { Delta } from 'quill';
import QuillCursors from 'quill-cursors';
import { io } from 'socket.io-client';
import { useParams } from 'next/navigation';
import { TOOLBAR_OPTIONS } from '../configs/editor';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import DocumentNameInput from './DocumentNameInput';
import { useToastStore } from '../store/useToastStore';
import { IUser } from '../interfaces/IUser';
import ActiveUsersList from './ActiveUsersList';
import { IActiveUserBadge } from '../interfaces/IActiveUserBadge';
import debounce from 'lodash.debounce';

const SAVE_INTERVAL_MS = 5000;

Quill.register('modules/cursors', QuillCursors);
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
  const [activeUsers, setActiveUsers] = useState<IActiveUserBadge[]>([]);
  const [mode, setMode] = useState('');
  const cursorsRef = useRef<QuillCursors | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  // Debounced Save Function to reduce the number of save requests
  const debouncedSave = useRef(
    debounce(() => {
      if (socketRef.current && documentId) {
        const content = quill?.getContents();
        socketRef.current.emit('save-document', { documentId, content });
      }
    }, SAVE_INTERVAL_MS)
  ).current;

  // Initialize Socket
  useEffect(() => {
    const _socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      transports: ['websocket', 'polling'],
      auth: { token: access_token },
      query: { documentId }
    });

    setSocket(_socket);
    socketRef.current = _socket;

    return () => {
      _socket.disconnect();
    };
  }, [access_token, documentId]);

  // Handle incoming changes from the server
  useEffect(() => {
    if (!socket || !quill) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const receiveChangesHandler = (content: any) => {
      quill.setContents(content);
    };

    socket.on('receive-changes', receiveChangesHandler);

    return () => {
      socket.off('receive-changes', receiveChangesHandler);
    };
  }, [socket, quill]);

  // Load document on initial connection
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once('load-document', document => {
      setDocumentName(document.title);
      quill.setContents(document.doc.ops);
      setMode(document.role);
      if (document.role === 'Viewer') {
        setDisableInput(true);
        quill.disable();
        return;
      }
      quill.enable();
    });

    const { first_name, last_name } = user as IUser;
    socket.emit('get-document', { documentId, userId: user?.id, first_name, last_name });
  }, [socket, quill, documentId, user]);

  // Error handler
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

  // Listen for errors
  useEffect(() => {
    if (!socket) return;

    socket?.on('error', errorHandler);

    return () => {
      socket?.off('error', errorHandler);
    };
  }, [socket, errorHandler]);

  // Listen for document title updates
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

  // Handle text changes and save document
  useEffect(() => {
    if (!socket || !quill) return;

    const textChangeHandler = (delta: Delta, oldDelta: Delta, source: string) => {
      if (source !== 'user') return; // Only send changes made by the user
      const content = quill.getContents();
      socket.emit('send-changes', { documentId, content });
      debouncedSave();
    };

    quill.on('text-change', textChangeHandler);

    return () => {
      quill.off('text-change', textChangeHandler);
    };
  }, [socket, quill, documentId, debouncedSave]);

  // Handle user presence updates
  useEffect(() => {
    if (!socket) return;

    const handleUserPresence = (users: Array<{ first_name: string, last_name: string }>) => {
      setActiveUsers(users);
    };

    socket.on('update-user-presence', handleUserPresence);

    return () => {
      socket.off('update-user-presence', handleUserPresence);
    };
  }, [socket]);

  // Handle cursor movements
  useEffect(() => {
    if (!socket || !quill || !cursorsRef.current) return;

    const cursors = cursorsRef.current;

    // Listen for cursor updates
    socket.on('update-cursor', ({ userId, firstName, position }) => {
      cursors.createCursor(userId, firstName, getUserColor(userId));
      cursors.moveCursor(userId, position);
    });

    // Send cursor position when changed
    quill.on('selection-change', (range) => {
      if (range) {
        socket.emit('update-cursor', {
          userId: user?.id,
          firstName: user?.first_name,
          position: range,
        });
      }
    });

    return () => {
      socket.off('update-cursor');
    };
  }, [socket, quill, user]);

  const handleUpdateFileName = (newFileName: string) => {
    setDocumentName(newFileName);
    socket?.emit('update-document-title', { documentId, title: newFileName });
  };

  const wrapperRef: WrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const quillInstance = new Quill(editor, {
      theme: 'snow',
      modules: { 
        toolbar: TOOLBAR_OPTIONS,
        cursors: true  // Enable cursor module
      },
    });

    quillInstance.disable();
    quillInstance.setText('Loading Document...');
    setQuill(quillInstance);

    cursorsRef.current = quillInstance.getModule('cursors') as QuillCursors;
  }, []);

  return (
    <div className='relative p-4'>
      <div className="pb-4 flex justify-between items-center">
        <DocumentNameInput
          documentName={documentName}
          documentId={documentId as string}
          onUpdateFileName={handleUpdateFileName}
          disabled={disableInput}
        />
        <div>
          {mode && <div className="h3 text-white">You are in <b>{mode} </b> mode:</div>}
        </div>
        <ActiveUsersList activeUsers={activeUsers} />
      </div>
      <div ref={wrapperRef} className='editor-container w-full'></div>
    </div>
  );
};

// Generate unique cursor colors for users
const getUserColor = (userId: number) => {
  const hue = (userId * 37) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export default Editor;