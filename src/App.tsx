import { Fragment} from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage'
import './App.css'

function App() {

  return (
    <Fragment>
      <Router>
          <Routes>
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/" element = {<LandingPage/>}/>
              <Route path="/course/:courseCode" element = {<LandingPage/>}/>
          </Routes>
      </Router>
    </Fragment>
  )
}

export default App
