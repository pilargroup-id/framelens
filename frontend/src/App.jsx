import { BrowserRouter, Routes, Route } from "react-router-dom"
import Gallery from "./pages/Gallery"
import ImageEditorPage from "./pages/ImageEditorPage"
import PromptBuilderPage from "./pages/PromptBuilderPage"
import PromptBuilderGTPage from "./pages/PromptBuilderGTPage"
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
            <Layout pageTitle="Prompt Builder GS" pageSubtitle="Build AI prompts — Industrial Safety Product">
              <PromptBuilderPage />
            </Layout>
          }
        />
        <Route
          path="/prompt-builder-gt"
          element={
            <Layout pageTitle="Prompt Builder GT" pageSubtitle="Build AI prompts — Home Product / Goto">
              <PromptBuilderGTPage />
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