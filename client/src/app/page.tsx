'use client'

import Documents from "./(pages)/documents/page";
import ProtectedRoute from "./components/ProtectedRoutes";

export default function Home() {
  return (
    <ProtectedRoute>
      <Documents />
    </ProtectedRoute>
  );
}
