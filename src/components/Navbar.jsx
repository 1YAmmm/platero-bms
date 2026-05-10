import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconMenu, IconClose } from '../assets/svg/Icons';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Announcements', href: '#announcements' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-blue-900/95 backdrop-blur-md border-b border-blue-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center shadow-md flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Barangay Platero</p>
              <p className="text-blue-300 text-xs leading-tight">Biñan, Laguna</p>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.label} href={l.href}
                className="text-blue-200 hover:text-white hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                {l.label}
              </a>
            ))}
            <button
              onClick={() => navigate('/admin/login')}
              className="ml-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-md">
              Admin Login
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
            {open ? <IconClose size={22}/> : <IconMenu size={22}/>}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 pt-2 border-t border-blue-800 animate-fade-in">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                className="block text-blue-200 hover:text-white hover:bg-blue-800 px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1">
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); navigate('/admin/login'); }}
              className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
              Admin Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
