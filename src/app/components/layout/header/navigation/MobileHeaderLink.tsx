import { useState } from 'react';
import Link from 'next/link';
import { HeaderItem, SubmenuItem } from '../../../../types/layout/menu';
import { usePathname, useRouter } from 'next/navigation';

// Recursive mobile submenu component
const NestedMobileSubmenu: React.FC<{
  subItem: SubmenuItem;
  path: string;
  depth?: number;
}> = ({ subItem, path, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = subItem.submenu && subItem.submenu.length > 0;

  return (
    <div className="w-full">
      {hasChildren ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full py-2 px-3 rounded-md text-black dark:text-white hover:bg-section dark:hover:bg-semidark"
          >
            <span>{subItem.label}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m7 10l5 5l5-5"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-600 ml-3">
              {subItem.submenu!.map((nestedItem, idx) => (
                <NestedMobileSubmenu
                  key={idx}
                  subItem={nestedItem}
                  path={path}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={subItem.href}
          className={`block py-2 px-3 rounded-md ${subItem.href === path
            ? '!text-primary dark:text-primary font-medium'
            : 'text-gray hover:text-midnight_text dark:hover:text-white'
            }`}
        >
          {subItem.label}
        </Link>
      )}
    </div>
  );
};

const MobileHeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleToggle = () => {
    setSubmenuOpen(!submenuOpen);
  };
  const router = useRouter();

  const handlenav = (href: string) => {
    router.push(href)
  }

  const path = usePathname();

  return (
    <div className="relative w-full">
      <button
        onClick={item.submenu ? handleToggle : () => handlenav(item.href)}
        className={`flex items-center justify-between w-full py-2 px-3 rounded-md text-black focus:outline-none dark:text-white dark:text-opacity-60 ${path === item.href ? 'bg-primary text-white dark:bg-primary dark:text-white dark:text-opacity-100' : ' text-black dark:text-white '} ${(item.label && path.startsWith(`/${item.label.toLowerCase()}`)) ? "bg-primary text-white dark:bg-primary dark:text-white dark:text-opacity-100 " : null}`}
      >
        {item.label}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
            className={`transition-transform duration-200 ${submenuOpen ? 'rotate-180' : ''}`}
          >
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7 10l5 5l5-5" />
          </svg>
        )}
      </button>
      {submenuOpen && item.submenu && (
        <div className="bg-white dark:bg-darkmode py-2 px-3 w-full">
          {item.submenu.map((subItem, index) => (
            <NestedMobileSubmenu
              key={index}
              subItem={subItem}
              path={path}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderLink;

