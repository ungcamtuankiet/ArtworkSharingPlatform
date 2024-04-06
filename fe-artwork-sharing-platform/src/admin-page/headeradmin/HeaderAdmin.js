// HeaderAdmin.js
import React, { useState } from 'react';
import {BsSearch } from 'react-icons/bs';
import './HeaderAdmin.css';
import AvatarAdmin from './avataradmin/AvatarAdmin';

function HeaderAdmin({ onToggleSidebar }) {
    return (
        <header className="header">
                <form action="#">
                    <div class="form-input">
                        <input type="search" placeholder="Search..." />
                        <button type="submit" class="search-btn"><BsSearch  class='bx bx-search'/></button>
                    </div>
                </form>
                <AvatarAdmin/>
        </header>
    );
}

export default HeaderAdmin;
