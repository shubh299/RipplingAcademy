import { Link } from 'react-router-dom';
import CartIconNavBar from './CartIcon';

import './Styles/NavBar.css'

//TODO: replace link text with images

const NavBar = () => {
    return(
        <div className="Nav-bar">
            <div className="Nav-bar-logo"><Link to={'/'}>Logo</Link></div>
            <div className="Nav-bar-cart"><Link to={'/checkout'}><CartIconNavBar/></Link></div>
        </div>
    );
}

export default NavBar;