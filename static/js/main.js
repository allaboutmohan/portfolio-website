document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. INTRO SEQUENCE & LOADER
    // ==========================================
    const introOverlay = document.getElementById('intro-overlay');
    const heroName = document.getElementById('hero-name');
    const typewriterEl = document.getElementById('typewriter');
    
    // Split hero name for staggered CSS animation
    if (heroName) {
        const text = heroName.textContent;
        heroName.innerHTML = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.setProperty('--delay', `${i * 0.05}s`);
            heroName.appendChild(span);
        });
    }

    // Fade out loader
    setTimeout(() => {
        if (introOverlay) {
            introOverlay.style.opacity = '0';
            setTimeout(() => introOverlay.remove(), 800);
        }
        // Start Typewriter after name animation (approx 1s)
        setTimeout(initTypewriter, 1000);
    }, 500);


    // ==========================================
    // 2. CUSTOM LERP CURSOR (Desktop Only)
    // ==========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const isMobile = window.innerWidth < 768;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    if (!isMobile && cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows exactly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Lerp animation for the ring
        const renderCursor = () => {
            // Lerp factor (0 to 1, higher = faster)
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Hover states
        const interactables = document.querySelectorAll('a, button, .project-card, .hamburger, input, textarea');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
        });
    }


    // ==========================================
    // 3. UI INTERACTIONS (Nav, Tabs, Typewriter)
    // ==========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Typewriter
    function initTypewriter() {
        if (!typewriterEl) return;
        const text = typewriterEl.getAttribute('data-text');
        let index = 0;
        let isDeleting = false;
        
        function type() {
            const current = text.substring(0, index);
            typewriterEl.textContent = current;
            let typeSpeed = 100;
            if (isDeleting) typeSpeed /= 2;

            if (!isDeleting && index === text.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                typeSpeed = 500;
            }

            if (isDeleting) index--;
            else index++;

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
        });
    });

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    // ==========================================
    // 4. SCROLL OBSERVERS (Reveals & Skills)
    // ==========================================
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate child elements with stagger if it's a grid/timeline
                const children = entry.target.querySelectorAll('.project-card, .timeline-item, .skill-item');
                children.forEach((child, idx) => {
                    child.style.transitionDelay = `${idx * 0.1}s`;
                });

                // If it's the skills section, animate the bars
                if (entry.target.classList.contains('skills')) {
                    const bars = entry.target.querySelectorAll('.skill-progress');
                    bars.forEach((bar, idx) => {
                        setTimeout(() => {
                            bar.style.width = bar.getAttribute('data-level');
                        }, idx * 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));


    // ==========================================
    // 5. 3D CARD TILT & SPOTLIGHT (Vanilla JS)
    // ==========================================
    const tiltCards = document.querySelectorAll('.project-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (isMobile) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Spotlight position update
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Tilt logic
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -12; // Max 12deg
            const rotateY = ((x - centerX) / centerX) * 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            if (isMobile) return;
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


    // ==========================================
    // 6. THREE.JS PARTICLE UNIVERSE
    // ==========================================
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas && window.THREE) {
        const bgScene = new THREE.Scene();
        const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: false });
        
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const particleCount = isMobile ? 800 : 3000;
        const particles = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        
        const colorCyan = new THREE.Color('#00d4ff');
        const colorPurple = new THREE.Color('#7c3aed');

        for(let i = 0; i < particleCount * 3; i+=3) {
            posArray[i] = (Math.random() - 0.5) * 10;
            posArray[i+1] = (Math.random() - 0.5) * 10;
            posArray[i+2] = (Math.random() - 0.5) * 10;

            const mixColor = Math.random() > 0.5 ? colorCyan : colorPurple;
            colorArray[i] = mixColor.r;
            colorArray[i+1] = mixColor.g;
            colorArray[i+2] = mixColor.b;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const material = new THREE.PointsMaterial({
            size: isMobile ? 0.02 : 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particles, material);
        bgScene.add(particlesMesh);
        bgCamera.position.z = 3;

        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = (e.clientX / window.innerWidth) - 0.5;
            targetY = (e.clientY / window.innerHeight) - 0.5;
        });

        const clock = new THREE.Clock();

        const renderBg = () => {
            if (document.visibilityState === 'visible') {
                const elapsedTime = clock.getElapsedTime();
                
                particlesMesh.rotation.y = elapsedTime * 0.05;
                particlesMesh.rotation.x = elapsedTime * 0.02;

                // Parallax repulsion
                particlesMesh.position.x += (targetX * 0.5 - particlesMesh.position.x) * 0.05;
                particlesMesh.position.y += (-targetY * 0.5 - particlesMesh.position.y) * 0.05;
                
                // Opacity pulse
                material.opacity = 0.6 + Math.sin(elapsedTime * 2) * 0.2;

                bgRenderer.render(bgScene, bgCamera);
            }
            requestAnimationFrame(renderBg);
        };
        renderBg();

        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                bgCamera.aspect = window.innerWidth / window.innerHeight;
                bgCamera.updateProjectionMatrix();
                bgRenderer.setSize(window.innerWidth, window.innerHeight);
            }, 200);
        });
    }


    // ==========================================
    // 7. THREE.JS FLOATING MESH (Hero)
    // ==========================================
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas && window.THREE && !isMobile) {
        const hScene = new THREE.Scene();
        const hCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        const hRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
        
        hRenderer.setSize(500, 500);
        hRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
        const hMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x7c3aed,
            wireframe: true,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.9
        });
        
        const mesh = new THREE.Mesh(geometry, hMaterial);
        hScene.add(mesh);

        const pointLight = new THREE.PointLight(0x00d4ff, 2, 50);
        pointLight.position.set(2, 3, 4);
        hScene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        hScene.add(ambientLight);

        hCamera.position.z = 6;

        let isHovered = false;
        
        heroCanvas.addEventListener('mouseenter', () => isHovered = true);
        heroCanvas.addEventListener('mouseleave', () => isHovered = false);

        const targetColor = new THREE.Color();

        const renderHero = () => {
            if (document.visibilityState === 'visible') {
                const speed = isHovered ? 0.02 : 0.005;
                mesh.rotation.x += speed;
                mesh.rotation.y += speed;

                // Color shift
                if (isHovered) {
                    targetColor.setHex(0x00d4ff); // Cyan
                } else {
                    targetColor.setHex(0x7c3aed); // Purple
                }
                hMaterial.color.lerp(targetColor, 0.05);

                hRenderer.render(hScene, hCamera);
            }
            requestAnimationFrame(renderHero);
        };
        renderHero();
    }


    // ==========================================
    // 8. VANILLA CANVAS ANIMATED GRID (Contact)
    // ==========================================
    const contactCanvas = document.getElementById('contact-canvas');
    if (contactCanvas) {
        const ctx = contactCanvas.getContext('2d');
        let width, height;

        const resizeContact = () => {
            width = contactCanvas.parentElement.offsetWidth;
            height = contactCanvas.parentElement.offsetHeight;
            contactCanvas.width = width;
            contactCanvas.height = height;
        };
        resizeContact();
        window.addEventListener('resize', resizeContact);

        let time = 0;
        const spacing = 30;

        const renderGrid = () => {
            if (document.visibilityState === 'visible') {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = '#00d4ff';
                time += 0.05;

                for (let x = 0; x <= width; x += spacing) {
                    for (let y = 0; y <= height; y += spacing) {
                        const dist = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
                        const radius = (Math.sin(dist * 0.01 - time) + 1) * 1.5;
                        
                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            requestAnimationFrame(renderGrid);
        };
        renderGrid();
    }
});
