
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">This page has been laid to rest.</p>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-purple-700 hover:bg-purple-600"
        >
          Return to the Graveyard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
