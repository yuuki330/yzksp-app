import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className='min-h-screen bg-gray-100 flex flex-col'>
            <header className='bg-primary text-white shadow-lg'>
                <div className='container mx-auto px-4 py-4 flex justify-between items-center'></div>
                <h1 className='text-2xl font-heading font-bold'>出欠管理アプリ</h1>
                <nav>
                    <ul className='flex space-x-4'>
                        <li><Link to='/' className='hover:text-primary-light'>ホーム</Link></li>
                        <li><Link to='/events' className='hover:text-primary-light'>イベント一覧</Link></li>
                    </ul>
                </nav>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-gray-200 text-center py-4">
                <p>&copy; 2023 出欠管理アプリ. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;