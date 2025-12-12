import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Logging from "./pages/Logging/logging"
import Notizen from './pages/Notizen/notizen';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Logging />} /> */}
        <Route path="/" element={<Notizen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
