import { Link, Outlet } from 'react-router-dom';
import './App.less';

function App() {
  return (
    <div className="App">
      <nav className='nav'>
        <Link to="/CreateStoreT">CreateStoreT</Link>
        <Link to="/MobxT">MobxT</Link>
        <Link to="/MobxT2">MobxT2</Link>
      </nav>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
