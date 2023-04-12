import { Header } from "antd/es/layout/layout";
import logo from '../assets/images/logo.png'
import { Link } from "react-router-dom";

const HeaderNav: React.FC = () => {

    return (
        <Header className="header" style={{ 'height': 'fit-content', 'display': 'flex', 'alignItems': 'center', 'backgroundColor': '#aed8e6', 'justifyContent': 'center', 'padding': 10 }}>
            <Link to="/" style={{ maxHeight: 110 }}><img src={logo} alt="JCE - Careers Center" style={{ maxWidth: '100%', maxHeight: 110 }} /></Link>
            <div className="logo" />
        </Header>
    )
}

export default HeaderNav;