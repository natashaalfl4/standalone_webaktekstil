"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { HeaderItem, SubmenuItem } from '../../../../types/layout/menu';
import { usePathname } from 'next/navigation';

// Recursive component for nested submenus
const NestedSubmenuItem: React.FC<{
  subItem: SubmenuItem;
  path: string;
  clearCloseTimer: () => void;
  scheduleClose: (delay?: number) => void;
}> = ({ subItem, path, clearCloseTimer, scheduleClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const nestedTimer = useRef<number | null>(null);

  const clearNestedTimer = () => {
    if (nestedTimer.current) {
      clearTimeout(nestedTimer.current);
      nestedTimer.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
    clearNestedTimer();
    if (subItem.submenu && subItem.submenu.length > 0) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    nestedTimer.current = window.setTimeout(() => {
      setIsOpen(false);
      nestedTimer.current = null;
    }, 400);
    scheduleClose();
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={subItem.href || '#'}
        onClick={(e) => {
          if (subItem.submenu && subItem.submenu.length > 0 && subItem.href === '#') {
            e.preventDefault();
          }
        }}
        className={`block px-4 py-3 w-full flex items-center justify-between ${path === subItem.href
          ? 'text-white bg-primary hover:bg-blue-700'
          : 'text-midnight_text dark:text-white hover:bg-section dark:hover:bg-semidark'
          }`}
      >
        <span>{subItem.label}</span>
        {subItem.submenu && subItem.submenu.length > 0 && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="ml-2"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m9 6l6 6l-6 6"
            />
          </svg>
        )}
      </Link>

      {/* Render nested submenu flyout */}
      {subItem.submenu && subItem.submenu.length > 0 && isOpen && (
        <div
          className="absolute top-0 left-full ml-1 min-w-[14rem] bg-white dark:bg-darkmode shadow-2xl rounded-lg z-[9999] py-2"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={() => scheduleClose()}
        >
          {subItem.submenu.map((nestedItem, idx) => (
            <NestedSubmenuItem
              key={idx}
              subItem={nestedItem}
              path={path}
              clearCloseTimer={clearCloseTimer}
              scheduleClose={scheduleClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname()
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  const scheduleClose = (delay = 400) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setSubmenuOpen(false);
      closeTimer.current = null;
    }, delay);
  }

  useEffect(() => {
    // cleanup timer on unmount
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    }
  }, [])

  const handleMouseEnter = () => {
    clearCloseTimer();
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    scheduleClose();
  };

  const renderSubmenu = (items: SubmenuItem[]) => {
    return (
      <div className="py-2 mt-0.5 w-60 bg-white dark:bg-darkmode shadow-lg dark:shadow-darkmd rounded-lg">
        {items.map((subItem, idx) => (
          <NestedSubmenuItem
            key={idx}
            subItem={subItem}
            path={path}
            clearCloseTimer={clearCloseTimer}
            scheduleClose={scheduleClose}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${item.submenu ? "relative" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={item.href} className={`text-sm flex py-2 font-medium text-slate-700 hover:text-primary dark:text-white dark:hover:text-blue-400 transition-colors whitespace-nowrap`}>
        {item.label}
        {item.submenu && (
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" className="ml-0.5">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7 10l5 5l5-5" />
          </svg>
        )}
      </Link>
      {submenuOpen && item.submenu && (
        <div className={`absolute py-2 top-9 left-0 mt-0.5 w-60 overflow-visible z-[9999]`} data-aos="fade-up" data-aos-duration="300" onMouseEnter={() => clearCloseTimer()} onMouseLeave={() => scheduleClose()}>
          {renderSubmenu(item.submenu)}
        </div>
      )}
    </div >
  );
};

export default HeaderLink;
