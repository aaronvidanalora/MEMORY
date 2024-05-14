
import  { useContext } from 'react';
import { GlobalClicksContext } from '../App';

export default function Clicks() {
  const { totalClicks, setTotalClicks } = useContext(GlobalClicksContext);

  const handleClick = () => {
    setTotalClicks(prevTotalClicks => prevTotalClicks + 1);
  };

  return (
    <div className="p-1">
      <div className="p-2 bg-blue-950 w-10 text-center" onClick={handleClick}>
        <p className="text-white">{totalClicks}</p>
      </div>
    </div>
  );
}
