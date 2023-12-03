import React, {useState} from 'react'
import { useNavigate} from "react-router-dom"
import useAuth from '../hooks/useAuth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Loginn() {
 
  const { signin } = useAuth();
  const navigate = useNavigate();


  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
     
  const logar = () => {
      if(!userEmail | !userPassword){
          toast.warning("Preencha todos os campos!")
         
          return;
      }

      const res = signin(userEmail, userPassword)

      if(res){
          console.log(res)
          navigate("/home")
          return;
      }

     
  }


  
return (
 <div>
<ToastContainer />

   <div className='w-screen h-screen flex items-center justify-center'>

<div>

<div className='w-bgn h-96 bg-slate-600 rounded p-4 flex flex-col gap-4'>
    <h3 className='text-white'>Realizar Login</h3>
  <div>
      <input type="email" 
      onChange={(e) => setUserEmail(e.target.value)}
      value={userEmail}
      className='w-full p-2 rounded' 
      placeholder='Digite seu E-email' />

  </div>

  <div>
      <input type="password" 
      onChange={(e) => setUserPassword(e.target.value)}
      value={userPassword}
      className='w-full p-2 rounded'
       placeholder='Digite sua senha' />

  </div>

  <div>
      <button 
      onClick={logar}
      className='w-full p-2 text-center bg-orange-300 cursor-pointer'>ACESSAR APLICAÇÃO</button>
  </div>

</div>


</div>
</div>
 </div>
)
}
