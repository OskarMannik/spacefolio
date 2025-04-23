// Galaxy Portfolio Logic

// Ensure THREE is available globally
if (typeof THREE === 'undefined') {
    console.error('THREE.js library not loaded!');
}

// --- Portfolio Content Data ---
// IMPORTANT: Replace these placeholders with your actual content!
const aboutMeContent = {
    title: "About Me",
    text: `<p>Hello! We are Oskar and Philip, passionate developers exploring the vast universe of technology.</p>
           <p>We love creating exciting projects and are always looking for new challenges.</p>
           <p>This portfolio showcases some constellations of my work. Feel free to explore!</p>`
           // Consider adding a contact form link or info here too
};

const projectsData = [
    {
        id: "project-1",
        name: "PortfolioX",
        texture: 'assets/textures/planet1.jpeg', // CORRECTED EXTENSION
        description: "A foundational project demonstrating core web technologies and interactive 3D elements.",
        tech: "JavaScript, Three.js, HTML, CSS",
        liveUrl: "https://oskarmannik.github.io/PortXFolio-hack/", // Add live URL
        codeUrl: "#", // Add code URL
        image: 'assets/imgs/project1.png' // Add preview image path
    },
    {
        id: "project-2",
        name: "DataSphere Navigator",
        texture: 'assets/textures/planet2.jpeg', // CORRECTED EXTENSION
        description: "An interactive visualization tool that allows users to explore complex datasets through a 3D interface, revealing hidden patterns and insights.",
        tech: "React, D3.js, Three.js, Node.js",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/imgs/project2.png'
    },
    {
        id: "project-3",
        name: "EcoTracker Live",
        texture: 'assets/textures/planet3.jpg', // This seems correct based on file list
        description: "A real-time monitoring dashboard for environmental sensors, built with Python backend and featuring live data streams and historical analysis.",
        tech: "Python, Flask, WebSocket, PostgreSQL, Chart.js",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/imgs/project3.png'
    },
    {
        id: "project-4",
        name: "Synthwave Arcade",
        texture: 'assets/textures/planet4.jpeg', 
        description: "A retro-themed browser game developed with a focus on performance and engaging gameplay mechanics, using pure JavaScript and HTML5 Canvas.",
        tech: "JavaScript, HTML5 Canvas, Web Audio API",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/imgs/project4.png'
    },
    {
        id: "project-5",
        name: "CollaboraPad PWA",
        texture: 'assets/textures/planet5.jpeg', 
        description: "A progressive web application for real-time collaborative note-taking, featuring offline support and seamless synchronization across devices.",
        tech: "Vue.js, Firebase Realtime Database, PWA, Service Workers",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/imgs/project5.png'
    },
    // --- NEW PROJECTS ADDED BELOW ---
    // Add more projects as needed
];

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 28; // Start closer, but ensure all planets visible

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- Controls ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;  
controls.maxDistance = 100; 
let originalEnableDamping = controls.enableDamping; // Store initial damping state

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
    emissiveIntensity: 0.4,
    map: textureLoader.load('assets/textures/sun.jpeg'),
    color: 0xffff00
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.name = "AboutMeSun"; // Identifier for clicking
sunMesh.userData = aboutMeContent; // Attach data
scene.add(sunMesh);

// --- Planets (Projects) ---
const planets = []; // Holds planet meshes for interaction and animation
const planetGeometry = new THREE.SphereGeometry(0.8, 32, 32); // Restore geometry
const orbitRadiusBase = 8;
const angleStep = (Math.PI * 2) / projectsData.length;

// Restore original loop for creating sphere planets
projectsData.forEach((project, index) => {
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: project.texture ? textureLoader.load(project.texture) : null,
        color: !project.texture ? Math.random() * 0xffffff : 0xffffff // Fallback random color if no texture
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    const angle = angleStep * index;
    const orbitRadius = orbitRadiusBase + index * 3; // Stagger orbits
    planetMesh.position.x = Math.cos(angle) * orbitRadius;
    planetMesh.position.z = Math.sin(angle) * orbitRadius;
    planetMesh.position.y = THREE.MathUtils.randFloatSpread(1); // Keep slight vertical variation

    planetMesh.name = project.id; 
    planetMesh.userData = project; 
    planetMesh.orbitRadius = orbitRadius;
    planetMesh.angle = angle;
    planetMesh.orbitSpeed = 0.002 + Math.random() * 0.002; // Keep slower speed

    scene.add(planetMesh);
    planets.push(planetMesh);
    // Note: We will add planets to interactiveObjects later, after rocket setup
});

// --- Contact Rocket ---
// Remove old cone geometry/mesh
// const rocketGeometry = new THREE.ConeGeometry(0.5, 2, 16);
// const rocketMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.5 });
// const rocketMesh = new THREE.Mesh(rocketGeometry, rocketMaterial);
// rocketMesh.name = "ContactRocket"; // Identifier for clicking/hovering
// rocketMesh.position.set(0, 8, 0); // Position it above the sun
// rocketMesh.rotation.x = Math.PI; // Point it upwards
// scene.add(rocketMesh);

// Instantiate a loader
const loader = new THREE.GLTFLoader();

let loadedRocket = null; // Variable to hold the loaded rocket scene

// Continuous movement variables
let rocketVelocity = new THREE.Vector3(THREE.MathUtils.randFloatSpread(1), 0, THREE.MathUtils.randFloatSpread(1)).normalize(); // Start with random horizontal direction
const ROCKET_MAX_SPEED = 0.008;    // Max units per frame (Further Reduced from 0.02)
const ROCKET_STEERING_FORCE = 0.0002; // How quickly it changes direction (Further Reduced from 0.0005)
const ROCKET_TURN_SPEED = 0.025;   // How quickly it reorients (Slightly Adjusted)
const WANDER_RADIUS = 12;        // How far it roams from the center
const WANDER_Y_RANGE = 2;        // How much it moves up/down
const rocketYPosition = 8;       // Base height

// Quaternions for orientation correction
const horizontalCorrectionQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
const reverseDirectionQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
const targetOrientation = new THREE.Quaternion(); // To store calculated orientation

// Load a glTF resource
loader.load(
	// resource URL
	'assets/models/rocket.glb',
	// called when the resource is loaded
	function ( gltf ) {

		loadedRocket = gltf.scene;
        loadedRocket.name = "ContactRocket"; // Assign name for interaction

        // --- Adjust scale, position, rotation as needed ---
        const scale = 0.2; // Make it smaller
        loadedRocket.scale.set(scale, scale, scale);
        // Set initial rotation to horizontal and facing forward (relative to initial target)
        loadedRocket.quaternion.copy(horizontalCorrectionQuaternion).multiply(reverseDirectionQuaternion);

        // Initialize position randomly within bounds
        loadedRocket.position.set(
            THREE.MathUtils.randFloatSpread(WANDER_RADIUS),
            rocketYPosition + THREE.MathUtils.randFloatSpread(WANDER_Y_RANGE),
            THREE.MathUtils.randFloatSpread(WANDER_RADIUS)
        );

		scene.add( loadedRocket );

        // Add the loaded model to interactive objects AFTER it's loaded
        interactiveObjects.push(loadedRocket);
        console.log('Rocket model loaded and added to interactiveObjects.');

	},
	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened loading the rocket model:', error );
	}
);

// Array of interactive objects for raycasting - initially without rocket
const interactiveObjects = [sunMesh, ...planets];

// --- Interaction Variables ---
const defaultCursor = 'grab'; // Or 'default'
canvas.style.cursor = defaultCursor;

// --- Camera Animation State ---
let isAnimatingCamera = false;
let cameraAnimationTarget = new THREE.Vector3();
const cameraAnimationSpeed = 1.5; 
let targetOrbitTarget = null;
let initialCameraPosition = new THREE.Vector3();
let isAnimatingCameraBack = false; 
let currentAnimationTargetObject = null; 
let flyBackTriggeredBy = null; 
let pausedPlanet = null; // Keep track of the currently viewed/paused planet

// --- Raycasting for Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// DOM Elements
const tooltipElement = document.getElementById('tooltip');
const aboutModal = document.getElementById('about-modal'); // Changed from aboutOverlay
const aboutContentContainer = document.getElementById('about-overlay-content'); // Keep existing ID for content
const projectModal = document.getElementById('project-modal');
const projectTitleEl = document.getElementById('project-title');
const projectImageEl = document.getElementById('project-image');
const projectDescriptionEl = document.getElementById('project-description');
const projectTechEl = document.getElementById('project-tech');
const projectLiveLinkEl = document.getElementById('project-live-link');
const projectCodeLinkEl = document.getElementById('project-code-link');
const contactModal = document.getElementById('contact-modal'); // Added for consistency

// Updated: Generic function to start fly-in animation
function startCameraAnimation(targetObject, zoomOffset) {
    if (isAnimatingCamera || isAnimatingCameraBack) {
        console.log("Animation start ignored: Already animating.");
        return;
    }
    
    console.log(`Attempting to start fly-in animation towards ${targetObject.name}`); 
    initialCameraPosition.copy(camera.position);
    targetOrbitTarget = controls.target.clone(); 
    originalEnableDamping = controls.enableDamping; // Store current damping state

    currentAnimationTargetObject = targetObject;

    const direction = new THREE.Vector3();
    targetObject.getWorldPosition(direction); 
    cameraAnimationTarget.copy(direction);
    direction.sub(camera.position).normalize().multiplyScalar(-zoomOffset); 
    cameraAnimationTarget.add(direction);
    if (targetObject === sunMesh && cameraAnimationTarget.lengthSq() < 1) {
         console.warn("Calculated target too close to origin for Sun, adjusting.");
         cameraAnimationTarget.set(0, 1, zoomOffset); 
    }
    console.log("Calculated target position:", cameraAnimationTarget); 
    
    // --- Disable controls and damping --- 
    controls.enabled = false;
    controls.enableDamping = false; // <<< Disable damping during animation
    isAnimatingCamera = true;
    console.log("isAnimatingCamera set to true. Controls and Damping disabled."); 
}

// Function to show the About Me modal (Renamed and updated)
function showAboutModal() {
    console.log("Attempting to show About Modal...");
    if (!aboutModal || !aboutContentContainer) {
        console.error("About Modal elements not found!");
        return;
    }
    console.log("Populating About Modal content.");
    aboutContentContainer.innerHTML = aboutMeContent.text;
    aboutModal.style.display = 'block'; // Use display block like other modals
    console.log("Set 'display: block' for about-modal.");
    controls.enabled = false; // Keep disabled
    console.log("OrbitControls remain disabled.");
}

function showProjectModal(data) {
    projectTitleEl.textContent = data.name;
    projectImageEl.src = data.image;
    projectImageEl.alt = data.name + " Preview";
    projectDescriptionEl.textContent = data.description;
    projectTechEl.textContent = data.tech;
    projectLiveLinkEl.href = data.liveUrl;
    projectCodeLinkEl.href = data.codeUrl;
    projectLiveLinkEl.style.display = (data.liveUrl && data.liveUrl !== '#') ? 'inline' : 'none';
    projectCodeLinkEl.style.display = (data.codeUrl && data.codeUrl !== '#') ? 'inline' : 'none';

    projectModal.style.display = 'block';
    controls.enabled = false; // Keep controls disabled
    console.log("Showing project modal. OrbitControls disabled.");
    // Planet is already paused by onMouseClick
}

// Function to show Contact Modal
function showContactModal() {
    if (contactModal) {
        console.log("Showing contact modal.");
        contactModal.style.display = 'block';
        // Keep controls disabled if animating, otherwise enable
        if (!isAnimatingCamera && !isAnimatingCameraBack) {
             controls.enabled = false; // Disable controls when contact modal is open
             console.log("Controls disabled while contact modal open.");
        } else {
             console.log("Keeping controls disabled (camera animating).")
        }
    }
}

function onMouseClick(event) {
    // Don't process clicks if a modal is visible or camera is animating
    if (isAnimatingCamera || isAnimatingCameraBack ||
        (aboutModal && aboutModal.style.display === 'block') || // Check aboutModal
        (projectModal && projectModal.style.display === 'block') ||
        (contactModal && contactModal.style.display === 'block')) { // Check contactModal
        return;
    }

    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check intersections with interactive objects
    const intersects = raycaster.intersectObjects(interactiveObjects, true); // Add true for recursive check inside models

    if (intersects.length > 0) {
        // Find the highest level object with a name we care about
        let clickedNamedObject = null;
        for(let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            // Traverse up scene graph to find the named parent (sun, planet, or loaded rocket)
            while (obj.parent && !interactiveObjects.includes(obj)) {
                obj = obj.parent;
            }
            if (interactiveObjects.includes(obj)) {
                clickedNamedObject = obj;
                break; // Found the main interactive object
            }
        }

        if(clickedNamedObject){
            console.log(`Clicked on: ${clickedNamedObject.name}`); // Log clicked object
            if (clickedNamedObject.name === "AboutMeSun") {
                // --- PAUSE ANY PREVIOUSLY PAUSED PLANET (if any) ---
                if (pausedPlanet) {
                    pausedPlanet.isPaused = false;
                    console.log(`Resuming planet ${pausedPlanet.name} before focusing on sun.`);
                    pausedPlanet = null;
                }
                 // --- END PAUSE ---
                startCameraAnimation(clickedNamedObject, 6.0);
            } else if (clickedNamedObject.name === "ContactRocket") {
                // --- PAUSE ANY PREVIOUSLY PAUSED PLANET (if any) ---
                 if (pausedPlanet) {
                    pausedPlanet.isPaused = false;
                    console.log(`Resuming planet ${pausedPlanet.name} before opening contact.`);
                    pausedPlanet = null;
                }
                 // --- END PAUSE ---
                console.log("Contact rocket clicked!");
                // Start camera animation towards rocket *before* showing modal
                startCameraAnimation(clickedNamedObject, 3.0); // Zoom closer to rocket
                // Modal will be shown after animation finishes in animate() loop

            } else if (clickedNamedObject.userData && clickedNamedObject.userData.id?.startsWith('project-')) {
                console.log(`Clicked on Project Planet: ${clickedNamedObject.name}`);
                // --- PAUSE PLANET IMMEDIATELY ---
                if (pausedPlanet && pausedPlanet !== clickedNamedObject) {
                    pausedPlanet.isPaused = false;
                     console.log(`Resuming previous planet ${pausedPlanet.name}.`);
                }
                pausedPlanet = clickedNamedObject;
                if(pausedPlanet) {
                    pausedPlanet.isPaused = true;
                    console.log(`>>> Pausing planet: ${pausedPlanet.name} immediately on click.`);
                } else {
                     console.warn("Could not identify clicked planet object to pause immediately.");
                }
                 // --- END PAUSE ---
                startCameraAnimation(clickedNamedObject, 3.0);
            }
        } else {
            console.log("Clicked part of model, but didn't find named parent.");
        }
    } else {
        // console.log("Click detected, but no interactive object intersected.");
    }
}
window.addEventListener('click', onMouseClick, false);

// Function to handle mouse movement for hover effects
function onMouseMove(event) {
    // Don't show hover effects if a modal is active or camera is animating
    if (isAnimatingCamera || isAnimatingCameraBack ||
        (aboutModal && aboutModal.style.display === 'block') || // Check aboutModal
        (projectModal && projectModal.style.display === 'block') ||
        (contactModal && contactModal.style.display === 'block')) { // Check contactModal
        tooltipElement.style.display = 'none';
        canvas.style.cursor = defaultCursor;
        return;
    }

    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check intersections with interactive objects
    // Ensure recursive check is enabled for models if not already
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
        // Find the main interactive object (sun, planet sphere, loaded rocket scene)
        let hoveredNamedObject = null;
        for(let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            while (obj.parent && !interactiveObjects.includes(obj)) { 
                obj = obj.parent;
            }
            if (interactiveObjects.includes(obj)) {
                hoveredNamedObject = obj;
                break; 
            }             
        }

        if (hoveredNamedObject) {
            let objectName = '';
            
            if (hoveredNamedObject.name === "AboutMeSun") { objectName = "About Me"; }
            else if (hoveredNamedObject.name === "ContactRocket") { objectName = "Contact Me"; }
            else if (hoveredNamedObject.userData && hoveredNamedObject.userData.name) { objectName = hoveredNamedObject.userData.name; }

            if (objectName) {
                // --- Calculate position above object using bounding box ---
                const boundingBox = new THREE.Box3().setFromObject(hoveredNamedObject); 
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                // Point slightly above the top-center of the bounding box
                const topCenterOffset = new THREE.Vector3(0, size.y / 2 + 0.6, 0); 
                const tooltipAnchor3D = center.add(topCenterOffset);
                
                const projectedPosition = tooltipAnchor3D.project(camera); 
                // ---------------------------------------------------------

                const isVisible = Math.abs(projectedPosition.x) <= 1 && Math.abs(projectedPosition.y) <= 1 && projectedPosition.z < 1;

                if (isVisible) {
                    const screenX = (projectedPosition.x + 1) / 2 * window.innerWidth;
                    const screenY = (-projectedPosition.y + 1) / 2 * window.innerHeight;
                    
                    tooltipElement.textContent = objectName;
                    tooltipElement.style.left = `${screenX}px`;
                    tooltipElement.style.top = `${screenY}px`;
                    // Center the tooltip ON the projected anchor point
                    tooltipElement.style.transform = 'translate(-50%, -50%)'; 
                    tooltipElement.style.display = 'block';
                    canvas.style.cursor = 'pointer';
                } else {
                    tooltipElement.style.display = 'none';
                    canvas.style.cursor = defaultCursor;
                }
            } else {
                 tooltipElement.style.display = 'none';
                 canvas.style.cursor = defaultCursor;
            }
        } else {
             // No named interactive object found up the hierarchy
            tooltipElement.style.display = 'none';
            canvas.style.cursor = defaultCursor;
        }

    } else {
        tooltipElement.style.display = 'none';
        canvas.style.cursor = defaultCursor;
    }
}
window.addEventListener('mousemove', onMouseMove, false);

// --- Animation Loop ---
const clock = new THREE.Clock(); // For smooth animation

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // Use delta for smoother frame rate independence if needed

    // Handle Camera Fly-in Animation
    if (isAnimatingCamera) {
        console.log("Animating camera fly-in...");
        camera.position.lerp(cameraAnimationTarget, cameraAnimationSpeed * delta);
        const distanceToTarget = camera.position.distanceTo(cameraAnimationTarget);
        console.log(`  Distance to target: ${distanceToTarget.toFixed(2)}`);

        if (distanceToTarget < 0.5) {
            console.log("  Reached target!");
            isAnimatingCamera = false;
            camera.position.copy(cameraAnimationTarget); // Snap position

            if (currentAnimationTargetObject) {
                 console.log(`  Animation finished for: ${currentAnimationTargetObject.name}`);
                 // --- Defer showing modal/overlay to next frame --- 
                 const targetToShow = currentAnimationTargetObject;
                 requestAnimationFrame(() => {
                     if (targetToShow.name === "AboutMeSun") {
                         showAboutModal(); // Call the updated function
                     } else if (targetToShow.userData && targetToShow.userData.id?.startsWith('project-')) {
                         showProjectModal(targetToShow.userData);
                     } else if (targetToShow.name === "ContactRocket") {
                         showContactModal(); // Show contact modal after animation
                     }
                 });
                 // --------------------------------------------------

            } else {
                 console.warn("  Camera animation finished but target object was null.");
            }
        }
    }
    // Handle Camera Fly-back Animation
    else if (isAnimatingCameraBack) {
        console.log(">>> Animating fly-back... Current Y:", camera.position.y.toFixed(2)); // Log entry and position
        camera.position.lerp(initialCameraPosition, cameraAnimationSpeed * delta);

        const distanceToStart = camera.position.distanceTo(initialCameraPosition);
         console.log(`>>> Fly-back distance to start: ${distanceToStart.toFixed(2)}`); // Log distance

        if (distanceToStart < 0.5) {
            console.log("Fly-back animation finished.");
            isAnimatingCameraBack = false;
            camera.position.copy(initialCameraPosition);

            // Resume planet if fly-back was triggered by project or about modal closing
            if (flyBackTriggeredBy === 'project' || flyBackTriggeredBy === 'about') {
                console.log(`${flyBackTriggeredBy} fly-back finished. Resuming planet if paused.`);
                if (pausedPlanet) {
                    pausedPlanet.isPaused = false;
                    console.log(`Resumed planet: ${pausedPlanet.name}`);
                    pausedPlanet = null;
                } else {
                     console.warn(`${flyBackTriggeredBy} fly-back finished, but no planet was marked as paused.`);
                }
            }
             flyBackTriggeredBy = null;

            // Restore original controls target and enable controls
            if (targetOrbitTarget) {
                controls.target.copy(targetOrbitTarget);
            }
            controls.enabled = true; // <<< Re-enable controls
            console.log(`>>> CONTROLS ENABLED set to: ${controls.enabled}`); // <<< ADD SPECIFIC LOG
            controls.enableDamping = originalEnableDamping;
            controls.update();
            console.log("Controls enabled after fly-back.");
            currentAnimationTargetObject = null;
        }
    }
    // Update Controls if enabled and not animating
    else {
        if (controls.enabled) {
            controls.update();
        }
    }

    // --- Animate Rocket (if loaded) ---
    if (loadedRocket) {
        // 1. Calculate Steering Force (Wander)
        let steer = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(2) - 1, // -1 to 1
            THREE.MathUtils.randFloatSpread(2) - 1, // -1 to 1  (Allows vertical wandering)
            THREE.MathUtils.randFloatSpread(2) - 1  // -1 to 1
        );
        steer.normalize();
        steer.multiplyScalar(ROCKET_STEERING_FORCE);

        // 2. Apply Boundary Steering (Re-enabled)
        
        const distanceCenter = loadedRocket.position.distanceTo(new THREE.Vector3(0, rocketYPosition, 0));
        if (distanceCenter > WANDER_RADIUS) {
            let steerToCenter = new THREE.Vector3(0, rocketYPosition, 0).sub(loadedRocket.position); // Target point is center at base height
            steerToCenter.normalize();
            // Apply horizontal component more strongly if far out
            steer.x += steerToCenter.x * ROCKET_STEERING_FORCE * 2; 
            steer.z += steerToCenter.z * ROCKET_STEERING_FORCE * 2;
            // Apply vertical component gently 
            steer.y += steerToCenter.y * ROCKET_STEERING_FORCE * 0.5; 
        }
        
        // Y boundary check (Keep it within WANDER_Y_RANGE of rocketYPosition)
        let verticalCorrectionForce = 0;
        if(loadedRocket.position.y > rocketYPosition + WANDER_Y_RANGE/2) {
            verticalCorrectionForce = (rocketYPosition + WANDER_Y_RANGE/2) - loadedRocket.position.y; // Negative force (down)
        } else if (loadedRocket.position.y < rocketYPosition - WANDER_Y_RANGE/2) {
             verticalCorrectionForce = (rocketYPosition - WANDER_Y_RANGE/2) - loadedRocket.position.y; // Positive force (up)
        }
        // Apply vertical correction force strongly
        if (verticalCorrectionForce !== 0) {
             steer.y += verticalCorrectionForce * ROCKET_STEERING_FORCE * 4; // Strong vertical correction
        }
        

        // 3. Update Velocity
        rocketVelocity.add(steer);
        rocketVelocity.clampLength(0, ROCKET_MAX_SPEED); // Limit speed

        // 4. Update Position
        loadedRocket.position.add(rocketVelocity);

        // 5. Update Orientation (Smooth Turn)
        if (rocketVelocity.lengthSq() > 0.0001) { 
             const lookTargetPos = loadedRocket.position.clone().add(rocketVelocity); 
             const tempMatrix = new THREE.Matrix4();
             tempMatrix.lookAt(loadedRocket.position, lookTargetPos, loadedRocket.up);
             targetOrientation.setFromRotationMatrix(tempMatrix);
             targetOrientation.multiply(horizontalCorrectionQuaternion);
             targetOrientation.multiply(reverseDirectionQuaternion);
             loadedRocket.quaternion.slerp(targetOrientation, ROCKET_TURN_SPEED);
         }
    }

    // Rotate Sun (always)
    sunMesh.rotation.y += 0.001;

    // --- Animate Planets ---
    planets.forEach(planet => {
         // Check if planet is paused
         if (planet.isPaused) {
             // Log position when skipped
             console.log(`Skipping animation for paused planet: ${planet.name} at x=${planet.position.x.toFixed(2)}`); 
             return; // Skip animation if paused
         }

        // Original animation logic
        if (planet instanceof THREE.Mesh && typeof planet.angle !== 'undefined' && typeof planet.orbitSpeed !== 'undefined' && typeof planet.orbitRadius !== 'undefined') {
            // Log position before animating
            // console.log(`Animating planet: ${planet.name} starting at x=${planet.position.x.toFixed(2)}`); 
        planet.angle += planet.orbitSpeed;
        planet.position.x = Math.cos(planet.angle) * planet.orbitRadius;
        planet.position.z = Math.sin(planet.angle) * planet.orbitRadius;
            // Log position after animating
            // console.log(`   Animated planet: ${planet.name} ending at x=${planet.position.x.toFixed(2)}`);
            
            // Add self-rotation
            if (planet.children.length > 0) { 
                 planet.children[0].rotation.y += 0.005; 
            } else {
                 planet.rotation.y += 0.005; 
            }
        }
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

// --- Global Modal Close Function --- 
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    console.log(`closeModal called for: ${modalId}`);

    if (modalId === 'project-modal' || modalId === 'about-modal' || modalId === 'contact-modal') {
        // Handle fly-back for Project, About, and Contact modals
        if (isAnimatingCameraBack) {
            console.log(`${modalId} close ignored: fly-back already in progress.`);
            return;
        }
        console.log(`>>> ${modalId} close: Hiding modal AND Initiating fly-back.`);
        // --- HIDE MODAL IMMEDIATELY --- 
        modal.style.display = 'none';
        // ----------------------------- 
        // Set trigger source based on modal type
        if (modalId === 'project-modal') { flyBackTriggeredBy = 'project'; }
        else if (modalId === 'about-modal') { flyBackTriggeredBy = 'about'; }
        else if (modalId === 'contact-modal') { flyBackTriggeredBy = 'contact'; }

        isAnimatingCameraBack = true;
        controls.enabled = false;
    } else {
        // Default case for any other potential modals (future-proofing)
        modal.style.display = 'none';
        console.log(`Closed modal instantly (default case): ${modalId}`);
    }
};

// --- Background Click Listener --- 
window.addEventListener('click', (event) => {
    // Check if click is on the background of ANY visible modal
    const modals = [aboutModal, projectModal, contactModal];
    for (const modal of modals) {
        if (modal && modal.style.display === 'block' && event.target === modal) {
             console.log(`${modal.id} background clicked. Calling closeModal...`);
             closeModal(modal.id);
             break; // Close only the clicked modal
        }
    }
});