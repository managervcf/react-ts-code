import './resizable.css';
import { ResizableBox } from 'react-resizable';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

export const Resizable: React.FC<ResizableProps> = ({
  direction,
  children,
}) => (
  <ResizableBox width={Infinity} height={400} resizeHandles={['s']}>
    {children}
  </ResizableBox>
);
