import { Header } from "antd/es/layout/layout";
import logo from '../assets/images/logo.png'
import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { Menu } from "antd";

const HeaderNav: React.FC = () => {
    // const items = [
    //     { key: '1', label: 'Home', path: '/' },
    //     { key: '2', label: 'About', path: '/about' },
    //     { key: '3', label: 'Contact', path: '/contact' },
    // ]

    // const [selectedKey, setSelectedKey] = useState('3')

    // useEffect(() => {
    //     setSelectedKey(items.find((item) => document.location.pathname === item.path)?.key || '')
    // }, [window.location.pathname])

    return (
        <Header className="header" style={{ 'height': 'fit-content', 'display': 'flex', 'alignItems': 'center', 'backgroundColor': '#aed8e6', 'justifyContent': 'center', 'padding': 10 }}>
            <Link to="/" style={{ maxHeight: 110 }}><img src={logo} alt="JCE - Careers Center" style={{ maxWidth: '100%', maxHeight: 110 }} /></Link>
            <div className="logo" />
            {/* <Menu onClick={()=>null} items={items} selectedKeys={[selectedKey]} style={{ 'flex': 2, 'alignItems': 'center' }} theme="dark" mode="horizontal">
                {items.map((item) => (
                    <Menu.Item key={item.key} onClick={() => document.location.href = item.path}>{item.label}</Menu.Item>
                ))}
            </Menu> */}
        </Header>
    )
}

export default HeaderNav;