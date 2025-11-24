
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');

    const loadPage = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newMain = doc.querySelector('main');
            if (newMain && mainContent) {
                mainContent.innerHTML = newMain.innerHTML;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error("L'élément <main> n'a pas été trouvé dans la page chargée ou la page actuelle.");
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la page:', error);
        }
    };

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                loadPage(href);
            });
        }
    });
        // Open external links in a new tab
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.closest('nav')) {
                return; // Skip links inside nav
            }
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                link.setAttribute('target', '_blank');
            }
        });

        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const rootEl = document.documentElement;
        const themeIcon = darkModeToggle.querySelector('i');

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                rootEl.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon', 'text-yellow-300');
                themeIcon.classList.add('fa-sun', 'text-orange-400');
                localStorage.setItem('theme', 'dark');
            } else {
                rootEl.removeAttribute('data-theme');
                themeIcon.classList.remove('fa-sun', 'text-orange-400');
                themeIcon.classList.add('fa-moon', 'text-yellow-300');
                localStorage.setItem('theme', 'light');
            }
        };

        darkModeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme(prefersDark ? 'dark' : 'light');
        }

        // Mobile Menu
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // CV Modal
        const cvModal = document.getElementById('cvModal');
        const cvPreviewBtn = document.getElementById('cvPreviewBtn');
        const cvPreviewBtn2 = document.getElementById('cvPreviewBtn2');
        const closeModal = document.getElementById('closeModal');

        const openModal = () => {
            if (cvModal) {
                cvModal.classList.remove('hidden');
                cvModal.classList.add('flex');
            }
        };

        const closeModalFunc = () => {
            if (cvModal) {
                cvModal.classList.add('hidden');
                cvModal.classList.remove('flex');
            }
        };

        if (cvPreviewBtn) cvPreviewBtn.addEventListener('click', openModal);
        if (cvPreviewBtn2) cvPreviewBtn2.addEventListener('click', openModal);
        if (closeModal) closeModal.addEventListener('click', closeModalFunc);

        window.addEventListener('click', (event) => {
            if (event.target === cvModal) {
                closeModalFunc();
            }
        });
        
        const printCV = document.getElementById('printCV');
        if(printCV) {
            printCV.addEventListener('click', () => {
                const pdfViewer = document.getElementById('pdfViewer');
                if (pdfViewer) {
                    const pdfUrl = pdfViewer.src;
                    const printWindow = window.open(pdfUrl);
                    if(printWindow) {
                        printWindow.onload = () => {
                            printWindow.print();
                        };
                    }
                }
            });
        }

        // Back to top button
        const backToTopButton = document.getElementById('backToTop');

        if (backToTopButton) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopButton.classList.remove('hidden');
                } else {
                    backToTopButton.classList.add('hidden');
                }
            });

            backToTopButton.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }



        // Contact Form AJAX Submission
        const contactForm = document.getElementById('contactForm');
        const contactSuccessModal = document.getElementById('contactSuccessModal');
        const closeContactSuccessModal = document.getElementById('closeContactSuccessModal');

        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const form = e.target;
                const data = new FormData(form);
                const action = form.action;
                
                fetch(action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        if (contactSuccessModal) {
                            contactSuccessModal.classList.remove('hidden');
                            contactSuccessModal.classList.add('flex');
                        }
                        form.reset();
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert('Oops! There was a problem submitting your form');
                            }
                        })
                    }
                }).catch(error => {
                    alert('Oops! There was a problem submitting your form');
                });
            });
        }

        if (closeContactSuccessModal) {
            closeContactSuccessModal.addEventListener('click', () => {
                if (contactSuccessModal) {
                    contactSuccessModal.classList.add('hidden');
                    contactSuccessModal.classList.remove('flex');
                }
            });
        }

        // Project Modal
        const projectDetailsBtns = document.querySelectorAll('.project-details-btn');
        const projectModal = document.getElementById('projectModal');
        const closeProjectModal = document.getElementById('closeProjectModal');

        const projects = {
            1: {
                title: 'Livrable HA Proxy & Hearbeat',
                image: 'IMG HAPROXY.png',
                content: 'Création de machines debian/windows sur Linux et donc création d\'une sécurisation pour un portail Web. Tout cela crée en équipe.',
                tech: ['Linux', 'VMWare', 'HAProxy', 'Heartbeat'],
                github: '#',
                demo: '#'
            },
            2: {
                title: 'Livrable GLPI',
                image: 'IMG GLPI.png',
                content: 'Création d\'un site nommé "GLPI" permettant une création de ticket d\'assistance et permettant un inventaire informatique avancée pour les entreprises.',
                tech: ['GLPI', 'OCSInventory', 'Debian'],
                github: '#',
                demo: 'Livrable GLPI.pdf'
            },
            3: {
                title: 'Projet Nagios',
                image: 'IMG NAGIOS.png',
                content: 'Supervision et surveillance système et réseau avec Nagios pour garantir la disponibilité des services.',
                tech: ['Nagios', 'Linux', 'VMWare'],
                github: '#',
                demo: 'Projet Nagios.pdf'
            }
        };

        if (projectDetailsBtns.length > 0 && projectModal) {
            projectDetailsBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const projectId = btn.dataset.project;
                    const project = projects[projectId];
                    if (project) {
                        document.getElementById('projectModalTitle').textContent = project.title;
                        document.getElementById('projectModalImage').src = project.image;
                        document.getElementById('projectModalContent').textContent = project.content;
                        const techContainer = document.getElementById('projectModalTech');
                        techContainer.innerHTML = '';
                        project.tech.forEach(tech => {
                            const span = document.createElement('span');
                            span.className = 'bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full';
                            span.textContent = tech;
                            techContainer.appendChild(span);
                        });
                        document.getElementById('projectModalGithub').href = project.github;
                        document.getElementById('projectModalDemo').href = project.demo;
                        projectModal.classList.remove('hidden');
                        projectModal.classList.add('flex');
                    }
                });
            });
        }

        if (closeProjectModal) {
            closeProjectModal.addEventListener('click', () => {
                projectModal.classList.add('hidden');
                projectModal.classList.remove('flex');
            });
        }
        
        // Veille Modal
        const veilleDetailsBtns = document.querySelectorAll('.veille-details-btn');
        const veilleModal = document.getElementById('veilleModal');
        const closeVeilleModal = document.getElementById('closeVeilleModal');
        const closeVeilleModalBtn = document.getElementById('closeVeilleModalBtn');

        const veilles = {
            1: {
                title: "Qu'est ce qu'une veille technologique ?",
                content: "La veille technologique est un processus de suivi constant et actif des avancées techniques, scientifiques et technologiques dans un secteur spécifique. Cette dernière offre à une société, un groupe ou même une personne la possibilité de se tenir au courant des nouveautés, des tendances, des brevets, des produits, des outils ou encore des méthodes pour anticiper plus efficacement les évolutions et prendre des décisions stratégiques.",
                resources: [
                    { name: 'Wikipedia - Veille technologique', url: 'https://fr.wikipedia.org/wiki/Veille_technologique' }
                ]
            },
            2: {
                title: "Qu'est ce que j'utilise pour ma veille technologique ?",
                content: "Pour ma veille technologique, j'utilise les vidéos d'un créateur de contenu sur la plateforme YouTube nommé \"MiCode\". Dans ses vidéos diverses et variées, il parle de l'informatique et des actualités touchant de près ou de loin à l'intelligence artificielle. Cela me permet donc de comprendre comment des géants de l'informatique peuvent fonctionner. Je vous mets le lien pour aller y jeter un coup d'oeil, cela vaut le coup.",
                resources: [
                    { name: 'Chaîne YouTube de MiCode', url: 'https.www.youtube.com/c/MiCode' }
                ]
            }
        };

        if (veilleDetailsBtns.length > 0 && veilleModal) {
            veilleDetailsBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const veilleId = btn.dataset.veille;
                    const veille = veilles[veilleId];
                    if (veille) {
                        document.getElementById('veilleModalTitle').textContent = veille.title;
                        document.getElementById('veilleModalContent').textContent = veille.content;
                        const resourcesContainer = document.getElementById('veilleModalResources');
                        resourcesContainer.innerHTML = '';
                        veille.resources.forEach(resource => {
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.href = resource.url;
                            a.textContent = resource.name;
                            a.target = '_blank';
                            a.className = 'text-blue-500 hover:underline';
                            li.appendChild(a);
                            resourcesContainer.appendChild(li);
                        });
                        veilleModal.classList.remove('hidden');
                        veilleModal.classList.add('flex');
                    }
                });
            });
        }

        const closeVeilleModals = () => {
            if(veilleModal) {
                veilleModal.classList.add('hidden');
                veilleModal.classList.remove('flex');
            }
        };

        if (closeVeilleModal) {
            closeVeilleModal.addEventListener('click', closeVeilleModals);
        }
        if (closeVeilleModalBtn) {
            closeVeilleModalBtn.addEventListener('click', closeVeilleModals);
        }

        // Tableau Modal
        const tableauModal = document.getElementById('tableauModal');
        const tableauPreviewBtn = document.getElementById('tableauPreviewBtn');
        const tableauPreviewBtn2 = document.getElementById('tableauPreviewBtn2');
        const closeTableauModal = document.getElementById('closeTableauModal');
        const printTableau = document.getElementById('printTableau');

        const openTableauModal = () => {
            if (tableauModal) {
                tableauModal.classList.remove('hidden');
                tableauModal.classList.add('flex');
            }
        };

        const closeTableauModalFunc = () => {
            if (tableauModal) {
                tableauModal.classList.add('hidden');
                tableauModal.classList.remove('flex');
            }
        };

        if (tableauPreviewBtn) tableauPreviewBtn.addEventListener('click', openTableauModal);
        if (tableauPreviewBtn2) tableauPreviewBtn2.addEventListener('click', openTableauModal);
        if (closeTableauModal) closeTableauModal.addEventListener('click', closeTableauModalFunc);

        window.addEventListener('click', (event) => {
            if (event.target === tableauModal) {
                closeTableauModalFunc();
            }
        });

        if(printTableau) {
            printTableau.addEventListener('click', () => {
                const pdfViewer = document.getElementById('tableauPdfViewer');
                if (pdfViewer) {
                    const pdfUrl = pdfViewer.src;
                    const printWindow = window.open(pdfUrl);
                    if(printWindow) {
                        printWindow.onload = () => {
                            printWindow.print();
                        };
                    }
                }
            });
        }
    });
