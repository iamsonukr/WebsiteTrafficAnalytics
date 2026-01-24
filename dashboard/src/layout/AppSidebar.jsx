import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router";
import {
  Grid3x3,
  ChevronDown,
  MoreHorizontal,
  List,
  UserCircle,
  Users,
  ImageIcon,
  Layers,
  CalendarRangeIcon,
  Layers2,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    // icon: <Grid3x3 />,
    // name: "Dashboard",
    // path: "/dashboard",
  },
  // {
  //   icon: <Users />,
  //   name: "Users",
  //   path: "/users",
  //   adminOnly: true,

  // },
  {
    name: "Payments Due",
    icon: <ImageIcon />,
    path: "/payment-due",
    adminOnly: true,
  },
  {
    icon: <Grid3x3 />,
    name: "Snippets",
    subItems: [
      { name: "Payment Due JSX", path: "/payment-due-doc-jsx", pro: false },
      { name: "Payment Due HTML", path: "/payment-due-doc-html", pro: false },
    ],
  },

  // {
  //   name: "Subscriptions",
  //   icon: <CalendarRangeIcon />,
  //   path: "/subscription",
  //   adminOnly: true,
  // },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const {UserRole}=useAuth()
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});
  const [isAdmin, setIsAdmin] = useState(false);

  const updateIsAdmin=()=>{
    setIsAdmin(UserRole==='admin')
  }

  useEffect(() => {
    updateIsAdmin()
  }, [UserRole])

  // Compute isAdmin directly from profileData, with proper null checking

  // Memoize filtered items to prevent unnecessary re-renders
  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      if (item.adminOnly) {
        return isAdmin;
      }
      return true;
    });
  }, [isAdmin]);



  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  // Handle submenu toggle with proper event handling
  const handleSubmenuToggle = useCallback((index, menuType, event) => {
    // Prevent event bubbling
    event?.preventDefault?.();
    event?.stopPropagation?.();

    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  }, []);

  // Handle mouse events with proper cleanup
  const handleMouseEnter = useCallback(() => {
    if (!isExpanded) {
      setIsHovered(true);
    }
  }, [isExpanded, setIsHovered]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, [setIsHovered]);

  // Set active submenu based on current path
  useEffect(() => {
    let submenuMatched = false;
    const allItems = [
      { items: filteredNavItems, type: "main" },
    ];

    for (const { items, type } of allItems) {
      for (let index = 0; index < items.length; index++) {
        const nav = items[index];
        if (nav.subItems) {
          const matchedSubItem = nav.subItems.find(subItem => isActive(subItem.path));
          if (matchedSubItem) {
            setOpenSubmenu({ type, index });
            submenuMatched = true;
            break;
          }
        }
      }
      if (submenuMatched) break;
    }

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location.pathname, isActive, filteredNavItems]);

  // Calculate submenu heights
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const element = subMenuRefs.current[key];
      if (element) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          setSubMenuHeight((prevHeights) => ({
            ...prevHeights,
            [key]: element.scrollHeight || 0,
          }));
        });
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = useCallback((items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={`${menuType}-${nav.name}-${index}`}>
          {nav.subItems ? (
            <button
              type="button"
              onClick={(e) => handleSubmenuToggle(index, menuType, e)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
              aria-expanded={openSubmenu?.type === menuType && openSubmenu?.index === index}
              aria-controls={`submenu-${menuType}-${index}`}
            >
              <span
                className={`menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              id={`submenu-${menuType}-${index}`}
              ref={(el) => {
                if (el) {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`] || 'auto'}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={`${subItem.name}-${subItem.path}`}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  ), [isExpanded, isHovered, isMobileOpen, openSubmenu, subMenuHeight, isActive, handleSubmenuToggle]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <h1 className="text-2xl text-black dark:text-amber-50" >PayTrack Analytics</h1>
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;