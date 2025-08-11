import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
        <h1 className='text-black text-9xl font-extrabold'>404</h1>
        <h2>The page you're looking for doesn't exist.</h2>
        <Button onClick={() => navigate('/') } variant="destructive">Go to Home Page</Button>
    </div>
  )
}

export default NotFound