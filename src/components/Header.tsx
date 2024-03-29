import { Header } from "antd/es/layout/layout";
import logo from '../assets/images/logo.png'
import { Link } from "react-router-dom";
import { ReactNode } from "react";

const HeaderNav: React.FC<{ children: ReactNode, marginResponsive: number }> = (props) => {

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
                width: `100%`,
                position: 'fixed',
                zIndex: 999,
                boxShadow: 'rgba(0, 0, 0, 0.2) 0px -3px 0px inset, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.8) 4px 2px 4px'
            }}
        >
            <Link to="/">
                <img src={logo} alt="JCE - Careers Center" style={{ width: '100%', maxHeight: '110px', maxWidth: '500px', marginRight: props.marginResponsive }} />
            </Link>
            {props.children}
        </Header>
    )
}

export default HeaderNav;