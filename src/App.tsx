 import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import GitHubDropdown from './components/Dropdown';
 
import RealPage from './pages/realpage';
 
 
 
 
 
 
 const App = () => {
   return (
     <div className="bg-gray-950 h-screen w-full flex justify-center">
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<GitHubDropdown/>} />
           //@ts-ignore
          
           <Route path='/realpage' element={<RealPage/>} />
         </Routes>
       </BrowserRouter>
     </div>
   );
 }
 
 export default App
 