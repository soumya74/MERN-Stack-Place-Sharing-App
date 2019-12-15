import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer';
import BackDrop from '../UIElements/Backdrop'
import './MainNavigation.css';

const MainNavigation = (props) => {
    const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

    const openDrawerHandler = () => {
        setSideDrawerOpen(true)
    }

    const closeDrawerHandler = () => {
        setSideDrawerOpen(false)
    }


    return (
        <React.Fragment>
            { sideDrawerOpen && <BackDrop onClick={closeDrawerHandler}/>}
            <SideDrawer show={sideDrawerOpen} onClick={closeDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">Your Places</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    )
}

export default MainNavigation;