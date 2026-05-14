import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout }     from './components/Layout'
import { Dashboard }  from './pages/Dashboard'
import { NewRun }     from './pages/NewRun'
import { RunDetail }  from './pages/RunDetail'
import { Files }      from './pages/Files'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="run/new"  element={<NewRun />} />
          <Route path="run/:id"  element={<RunDetail />} />
          <Route path="files"    element={<Files />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
