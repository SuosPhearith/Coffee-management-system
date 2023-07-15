import React from 'react'
import '../notFound/NotFoundPage.css'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate();
    const handleLink = () =>{
        navigate('/dashboard')
    }
  return (
    <div className='notFound'>
        <div className='pageNotFound'>404 page Not found</div>
        <div  className='pageNotFoundMessage'>Go to the sidebar en click in any button or go to Home page.</div>
        <Button type='primary' onClick={handleLink}>Home page</Button>
    </div>
  )
}

export default NotFoundPage
