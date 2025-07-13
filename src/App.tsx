import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import NewsFeed from './components/NewsFeed'
import AdminPanel from './components/AdminPanel'
import { NewsProvider } from './context/NewsContext'

function App() {
  return (
    <NewsProvider>
      <div className="min-h-screen bg-gradient-to-br from-n64-dark via-n64-gray/10 to-n64-dark">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </NewsProvider>
  )
}

export default App