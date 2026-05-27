import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import { serverUrl } from './constants'
import axios from 'axios'

function App() {
  const dispatch = useDispatch()
  const [isWakingUp, setIsWakingUp] = React.useState(true);

  useEffect(()=>{
   const wakeUpServer = async () => {
     try {
       await axios.get(serverUrl + "/", { withCredentials: true });
       getCurrentUser(dispatch);
     } catch (error) {
       console.log("Server is still waking up...");
     } finally {
       setIsWakingUp(false);
     }
   }
   wakeUpServer();
  },[dispatch])

  const {userData} = useSelector((state)=>state.user)

  if (isWakingUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg font-medium">ExamNotes AI is waking up...</p>
          <p className="text-sm text-gray-500">This usually takes 30-60 seconds on the free tier.</p>
        </div>
      </div>
    );
  }
  return (
    <>
    <Routes>
      <Route path='/' element={userData? <Home/> : <Navigate to="/auth" replace/>}/>
      <Route path='/auth' element={userData ? <Navigate to="/" replace/> : <Auth/>}/>
      <Route path='/history' element={userData? <History/> : <Navigate to="/auth" replace/>}/>
      <Route path='/notes' element={userData? <Notes/> : <Navigate to="/auth" replace/>}/>
      <Route path='/pricing' element={userData? <Pricing/> : <Navigate to="/auth" replace/>}/>

      <Route path='/payment-success' element={<PaymentSuccess/>}/>
      <Route path='/payment-failed' element={<PaymentFailed/>}/>
    </Routes>
     
    </>
  )
}

export default App
