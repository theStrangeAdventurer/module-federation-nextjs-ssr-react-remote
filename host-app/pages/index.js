import Button from '../components/Button';
import dynamic from 'next/dynamic';

const Component = dynamic(() => import('remote/Button'))

export default function Home() {
  return (
    <div style={{ padding: '2%' }}>
      <h1>Next JS and React</h1>
      <h2>Host - Button</h2>
      <Button />
      <h2>Client - Button</h2>
      <Component />
    </div>
  );
}
