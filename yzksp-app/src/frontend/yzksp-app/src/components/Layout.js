import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContextのパスは適宜調整してください

const Layout = ({ children }) => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col'>
            <header className='bg-primary text-white shadow-lg'>
                <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
                    <h1 className='text-2xl font-heading font-bold'>出欠管理アプリ</h1>
                    <nav>
                        <ul className='flex space-x-4 items-center'>
                            <li><Link to='/' className='hover:text-primary-light'>ホーム</Link></li>
                            <li><Link to='/events' className='hover:text-primary-light'>イベント一覧</Link></li>
                            {isAuthenticated ? (
                                <>
                                    <li><Link to='/profile' className='hover:text-primary-light'>プロフィール</Link></li>
                                    <li><button onClick={logout} className='hover:text-primary-light'>ログアウト</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to='/login' className='hover:text-primary-light'>ログイン</Link></li>
                                    <li><Link to='/register' className='hover:text-primary-light'>登録</Link></li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
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