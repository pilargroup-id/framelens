import { BrowserRouter, Routes, Route } from "react-router-dom"
import Gallery from "./pages/Gallery"
import ImageEditorPage from "./pages/ImageEditorPage"
import PromptBuilderPage from "./pages/PromptBuilderPage"
import Layout from "./components/Layout"
import { AuthProvider, useAuth } from "./auth/AuthContext"
import ProtectedRoute from "./auth/ProtectedRoute"
import { useSessionGuard } from "./hooks/useSessionGuard"

function AppRoutes() {
  const { logout } = useAuth()

  useSessionGuard(() => {
    logout()
    const returnUrl = encodeURIComponent(window.location.origin)
    window.location.href = `${import.meta.env.VITE_PILARGROUP_URL}?return_url=${returnUrl}`
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout pageTitle="Gallery" pageSubtitle="Generated results saved on server">
              <Gallery />
            </Layout>
          }
        />
        <Route
          path="/image-editor"
          element={
            <Layout pageTitle="Image Editor" pageSubtitle="Edit images with AI">
              <ImageEditorPage />
            </Layout>
          }
        />
        <Route
          path="/prompt-builder"
          element={
            <Layout pageTitle="Prompt Builder" pageSubtitle="Build AI prompts without manual JSON editing">
              <PromptBuilderPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppRoutes />
      </ProtectedRoute>
    </AuthProvider>
  )
}