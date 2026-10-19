import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component scrolls the window and main page container
 * to the top whenever the current route/pathname changes.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // Also scroll any scrollable main-content or page-body containers
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
    const pageBody = document.querySelector('.page-body');
    if (pageBody) {
      pageBody.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};
