import { Routes, Route, useLocation } from 'react-router-dom';
import { PhoneShell } from './components/PhoneShell';
import { TabBar } from './components/TabBar';
import { ChatListPage } from './pages/ChatListPage';
import { ChatRoomPage } from './pages/ChatRoomPage';
import { MomentsPage } from './pages/MomentsPage';
import { MomentsPostPage } from './pages/MomentsPostPage';
import { ContactsPage } from './pages/ContactsPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { MePage } from './pages/MePage';

const TAB_PATHS = ['/', '/contacts', '/discover', '/me'];

export default function App() {
  const { pathname } = useLocation();
  const showTab = TAB_PATHS.includes(pathname);

  return (
    <PhoneShell>
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<ChatListPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/me" element={<MePage />} />
          <Route path="/chat/:id" element={<ChatRoomPage />} />
          <Route path="/moments" element={<MomentsPage />} />
          <Route path="/moments/post" element={<MomentsPostPage />} />
        </Routes>
      </div>
      {showTab && <TabBar />}
    </PhoneShell>
  );
}
