import { FC } from 'react';
import kalubet from '@assets/Kalubet.jpg';

interface LogoProps {
  height?: number;
  className?: string;
}

const Logo: FC<LogoProps> = ({ height = 40, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={kalubet} 
        alt="KaluBET" 
        className="h-[40px]"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default Logo;
