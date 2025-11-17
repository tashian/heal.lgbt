(function() {
    const tocLinks = document.querySelectorAll('.toc-sidebar a');
    const headings = [];

    // Build list of headings that match TOC links
    tocLinks.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        const heading = document.getElementById(id);
        if (heading) {
            headings.push({ id, element: heading, link });
        }
    });

    // Make sections collapsible
    const topLevelItems = document.querySelectorAll('.toc-sidebar nav#TableOfContents > ul > li');
    topLevelItems.forEach(item => {
        const nestedList = item.querySelector('ul');
        if (nestedList) {
            // Initially collapse
            nestedList.classList.add('collapsed');
        }
    });

    function updateActiveLink() {
        const scrollPos = window.scrollY + 100; // Offset for better UX

        let currentId = '';
        let currentParentItem = null;

        // Find the current section
        for (let i = headings.length - 1; i >= 0; i--) {
            if (headings[i].element.offsetTop <= scrollPos) {
                currentId = headings[i].id;
                break;
            }
        }

        // Find which top-level section the current heading belongs to
        let activeParentLi = null;

        // Update active states
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
                activeParentLi = link.closest('.toc-sidebar nav#TableOfContents > ul > li');
            }
        });

        // Collapse all sections except the active one
        topLevelItems.forEach(item => {
            const nestedList = item.querySelector('ul');
            if (nestedList) {
                if (item === activeParentLi) {
                    // Expand active section
                    nestedList.classList.remove('collapsed');
                } else {
                    // Collapse inactive sections
                    nestedList.classList.add('collapsed');
                }
            }
        });
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateActiveLink();

    // Add copy link icons to h2 and h3
    const linkIcon = '<svg viewBox="0 0 16 16"><path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/></svg>';
    const checkIcon = '<svg viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';

    const contentHeadings = document.querySelectorAll('article h2[id], article h3[id]');
    contentHeadings.forEach(heading => {
        const link = document.createElement('a');
        link.className = 'heading-link';
        link.href = '#' + heading.id;
        link.innerHTML = linkIcon;
        link.title = 'Copy link';

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = window.location.origin + window.location.pathname + '#' + heading.id;
            navigator.clipboard.writeText(url).then(() => {
                link.innerHTML = checkIcon;
                setTimeout(() => {
                    link.innerHTML = linkIcon;
                }, 1500);
            });
        });

        heading.appendChild(link);
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme');

    // Check for saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile TOC toggle
    const mobileTocToggle = document.querySelector('.mobile-toc-toggle');
    const tocNav = document.querySelector('.toc-sidebar nav#TableOfContents');

    mobileTocToggle.addEventListener('click', () => {
        tocNav.classList.toggle('mobile-open');
        mobileTocToggle.classList.toggle('active');
    });

    // Close menu when clicking a link on mobile
    tocLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                tocNav.classList.remove('mobile-open');
                mobileTocToggle.classList.remove('active');
            }
        });
    });
})();
