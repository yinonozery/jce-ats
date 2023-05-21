import { Header } from "antd/es/layout/layout";
import logo from '../assets/images/logo.png'
import { Link } from "react-router-dom";
import { ReactNode } from "react";

const HeaderNav: React.FC<{ children: ReactNode }> = (props) => {

    return (
        <Header
            className="header"
            style={{
                height: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#aed8e6',
                justifyContent: 'center',
                padding: '10px',
                width: '100%',
                position: 'fixed',
                zIndex: 999,
                boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'
            }}
        >
            <Link to="/" style={{ maxHeight: 110 }}><img src={logo} alt="JCE - Careers Center" style={{ maxWidth: '100%', maxHeight: 110 }} /></Link>
            {props.children}
        </Header>
    )
}

export default HeaderNav;