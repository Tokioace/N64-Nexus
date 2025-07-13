import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EventBuilder } from './components/EventBuilder';
import { EventList } from './components/EventList';
import { EventView } from './components/EventView';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/new" element={<EventBuilder />} />
        <Route path="/events/:id" element={<EventView />} />
        <Route path="/events/:id/edit" element={<EventBuilder />} />
      </Routes>
    </Layout>
  );
}

export default App;