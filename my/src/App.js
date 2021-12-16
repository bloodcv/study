// import logo from './logo.svg';
import './App.less';
import { Button, Divider } from 'antd';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Button type="primary">Button1</Button>
      <nav className="link_nav">
        <Link to="/test1">test1</Link>
        <Link to="/test2">test2</Link>
        <Link to="/page1">page1</Link>
        <Link to="/page2">page2</Link>
        <Link to="/base">base</Link>
        <Link to="/reftest">reftest</Link>
        <Link to="/basehook">basehook</Link>
        <Link to="/usestatet">usestate</Link>
        <Link to="/useeffectt">useeffect</Link>
      </nav>
      <Divider />
      <Outlet />
    </div>
  );
}

export default App;
