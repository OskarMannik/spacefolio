// Galaxy Portfolio Logic

// Ensure THREE is available globally
if (typeof THREE === 'undefined') {
    console.error('THREE.js library not loaded!');
}

// --- Portfolio Content Data ---
// IMPORTANT: Replace these placeholders with your actual content!
const aboutMeContent = {
    title: "About Me",
    text: `<p>Hello! I'm [Your Name/Team Name], a passionate developer/designer exploring the vast universe of technology.</p>
           <p>My journey began with [Your Story]. I specialize in [Your Skills] and love creating [What you love creating].</p>
           <p>This portfolio showcases some constellations of my work. Feel free to explore!</p>
           <p>Connect with me: [Link to LinkedIn/GitHub/etc.]</p>`
           // Consider adding a contact form link or info here too
};

const projectsData = [
    {
        id: "project-1",
        name: "Project Alpha",
        texture: 'assets/textures/planet1.jpeg', // CORRECTED EXTENSION
        description: "A brief description of Project Alpha, highlighting its goals and key features.",
        tech: "JavaScript, Three.js, HTML, CSS",
        liveUrl: "#", // Add live URL
        codeUrl: "#", // Add code URL
        image: 'assets/images/project1_preview.jpg' // Add preview image path
    },
    {
        id: "project-2",
        name: "Project Beta",
        texture: 'assets/textures/planet2.jpeg', // CORRECTED EXTENSION
        description: "Details about Project Beta, perhaps focusing on a different skill or technology.",
        tech: "React, Node.js, Express, MongoDB",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/images/project2_preview.jpg'
    },
    {
        id: "project-3",
        name: "Project Gamma",
        texture: 'assets/textures/planet3.jpg', // This seems correct based on file list
        description: "Information on Project Gamma, showcasing versatility or a specific achievement.",
        tech: "Python, Flask, PostgreSQL, Docker",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/images/project3_preview.jpg'
    },
    {
        id: "project-4",
        name: "Project Delta",
        // texture: 'assets/textures/planet4.jpg', // Temporarily removed - file missing
        description: "Description for Project Delta goes here. Maybe it was a cool data visualization?",
        tech: "D3.js, SVG, JavaScript",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/images/project4_preview.jpg'
    },
    {
        id: "project-5",
        name: "Project Epsilon",
        // texture: 'assets/textures/planet5.jpg', // Temporarily removed - file missing
        description: "What about Project Epsilon? Perhaps a mobile-friendly web app?",
        tech: "Vue.js, Firebase, PWA",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/images/project5_preview.jpg'
    },
    // --- NEW PROJECTS ADDED BELOW ---
    // Add more projects as needed
];

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30; // Start further back to see the system

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- Controls ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;  // Adjust as needed
controls.maxDistance = 100; // Adjust as needed

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 300);
pointLight.position.set(0, 0, 0); // Light emanates from the sun
scene.add(pointLight);

// --- Texture Loader ---
const textureLoader = new THREE.TextureLoader();

// --- Starfield ---
function addStarfield() {
    const starVertices = [];
    const starColors = [];
    const starSizes = [];
    const baseColor = new THREE.Color(0xffffff);

    for (let i = 0; i < 15000; i++) { // More stars
        const x = THREE.MathUtils.randFloatSpread(400); // Wider spread
        const y = THREE.MathUtils.randFloatSpread(400);
        const z = THREE.MathUtils.randFloatSpread(400);
        starVertices.push(x, y, z);
        const color = baseColor.clone().lerp(new THREE.Color(0xaaaaff), Math.random() * 0.3);
        starColors.push(color.r, color.g, color.b);
        starSizes.push(Math.random() * 1.5 + 0.5);
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}
addStarfield();

// --- Sun (About Me) ---
const sunGeometry = new THREE.SphereGeometry(2.5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffff00, 
    emissiveIntensity: 1,
    // map: textureLoader.load('assets/textures/sun.jpg'), // Temporarily removed - file missing
    color: 0xffff00 // Ensure it has a base color if emissive isn't enough
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.name = "AboutMeSun"; // Identifier for clicking
sunMesh.userData = aboutMeContent; // Attach data
scene.add(sunMesh);

// --- Planets (Projects) ---
const planets = []; // Holds planet meshes for interaction and animation
const planetGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const orbitRadiusBase = 8;
const angleStep = (Math.PI * 2) / projectsData.length;

projectsData.forEach((project, index) => {
    const planetMaterial = new THREE.MeshStandardMaterial({
        // Use texture from data IF it exists
        map: project.texture ? textureLoader.load(project.texture) : null,
        color: Math.random() * 0xffffff // Fallback random color if no texture
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    const angle = angleStep * index;
    const orbitRadius = orbitRadiusBase + index * 3; // Stagger orbits
    planetMesh.position.x = Math.cos(angle) * orbitRadius;
    planetMesh.position.z = Math.sin(angle) * orbitRadius;
    // Keep y=0 for planar orbits, or add variation

    planetMesh.name = project.id; // Use project ID for clicking
    planetMesh.userData = project; // Attach project data
    planetMesh.orbitRadius = orbitRadius;
    planetMesh.angle = angle;
    planetMesh.orbitSpeed = 0.005 + Math.random() * 0.005; // Vary speeds slightly

    scene.add(planetMesh);
    planets.push(planetMesh);
});

// --- Raycasting for Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// DOM Elements for Modals
const aboutModal = document.getElementById('about-modal');
const projectModal = document.getElementById('project-modal');
const aboutContentDiv = document.getElementById('about-content');
const projectTitleEl = document.getElementById('project-title');
const projectImageEl = document.getElementById('project-image');
const projectDescriptionEl = document.getElementById('project-description');
const projectTechEl = document.getElementById('project-tech');
const projectLiveLinkEl = document.getElementById('project-live-link');
const projectCodeLinkEl = document.getElementById('project-code-link');

function showAboutModal(data) {
    aboutContentDiv.innerHTML = data.text; // Use innerHTML to render paragraphs etc.
    aboutModal.style.display = 'block';
}

function showProjectModal(data) {
    projectTitleEl.textContent = data.name;
    projectImageEl.src = data.image;
    projectImageEl.alt = data.name + " Preview";
    projectDescriptionEl.textContent = data.description;
    projectTechEl.textContent = data.tech;
    projectLiveLinkEl.href = data.liveUrl;
    projectCodeLinkEl.href = data.codeUrl;

    // Hide links if URL is '#' or empty
    projectLiveLinkEl.style.display = (data.liveUrl && data.liveUrl !== '#') ? 'inline' : 'none';
    projectCodeLinkEl.style.display = (data.codeUrl && data.codeUrl !== '#') ? 'inline' : 'none';
    // Handle separator visibility maybe?

    projectModal.style.display = 'block';
}

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check intersections with sun and planets
    const intersects = raycaster.intersectObjects([sunMesh, ...planets]);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject.name === "AboutMeSun") {
            showAboutModal(clickedObject.userData);
        } else if (clickedObject.userData && clickedObject.userData.id?.startsWith('project-')) {
            showProjectModal(clickedObject.userData);
        }
    }
    // No need to handle background clicks explicitly unless closing modals
}
window.addEventListener('click', onMouseClick, false);

// --- Animation Loop ---
const clock = new THREE.Clock(); // For smooth animation

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // Time since last frame

    // Update controls
    controls.update();

    // Rotate Sun
    sunMesh.rotation.y += 0.001;

    // Orbit Planets
    planets.forEach(planet => {
        planet.angle += planet.orbitSpeed;
        planet.position.x = Math.cos(planet.angle) * planet.orbitRadius;
        planet.position.z = Math.sin(planet.angle) * planet.orbitRadius;
        planet.rotation.y += 0.01; // Planet's own rotation
    });

    renderer.render(scene, camera);
}

// --- Handle Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// --- Start Animation ---
animate();

// --- Global Modal Close Function (if not already in HTML) ---
// Make sure this function is accessible globally
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
};

// Optional: Close modal if clicking outside the content
window.addEventListener('click', (event) => {
    if (event.target === aboutModal) {
        closeModal('about-modal');
    }
    if (event.target === projectModal) {
        closeModal('project-modal');
    }
}); 