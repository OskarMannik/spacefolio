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
        texture: 'assets/textures/planet1.jpeg', // Restore texture
        description: "A brief description of Project Alpha, highlighting its goals and key features.",
        tech: "JavaScript, Three.js, HTML, CSS",
        liveUrl: "#", 
        codeUrl: "#", 
        image: 'assets/images/project1_preview.jpg' 
    },
    {
        id: "project-2",
        name: "Project Beta",
        texture: 'assets/textures/planet2.jpeg', // Restore texture
        description: "Details about Project Beta, perhaps focusing on a different skill or technology.",
        tech: "React, Node.js, Express, MongoDB",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/images/project2_preview.jpg'
    },
    {
        id: "project-3",
        name: "Project Gamma",
        texture: 'assets/textures/planet3.jpg', // Restore texture
        description: "Information on Project Gamma, showcasing versatility or a specific achievement.",
        tech: "Python, Flask, PostgreSQL, Docker",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/images/project3_preview.jpg'
    },
    {
        id: "project-4",
        name: "Project Delta",
        texture: 'assets/textures/planet4.jpeg', // Assign texture
        description: "Description for Project Delta goes here. Maybe it was a cool data visualization?",
        tech: "D3.js, SVG, JavaScript",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/images/project4_preview.jpg'
    },
    {
        id: "project-5",
        name: "Project Epsilon",
        texture: 'assets/textures/planet5.jpeg', // Assign texture
        description: "What about Project Epsilon? Perhaps a mobile-friendly web app?",
        tech: "Vue.js, Firebase, PWA",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/images/project5_preview.jpg'
    },
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
let isAnimatingCameraBack = false; // Only used for exiting About overlay for now
let currentAnimationTargetObject = null; // Store the object we are flying towards
let flyBackTriggeredBy = null; // Keep track of what triggered fly-back ('about' or 'project')
let pausedPlanet = null; // Keep track of the currently viewed/paused planet

// --- Raycasting for Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// DOM Elements
const tooltipElement = document.getElementById('tooltip');
const aboutOverlay = document.getElementById('about-overlay');
const aboutOverlayContent = document.getElementById('about-overlay-content');
const projectModal = document.getElementById('project-modal');
const projectTitleEl = document.getElementById('project-title');
const projectImageEl = document.getElementById('project-image');
const projectDescriptionEl = document.getElementById('project-description');
const projectTechEl = document.getElementById('project-tech');
const projectLiveLinkEl = document.getElementById('project-live-link');
const projectCodeLinkEl = document.getElementById('project-code-link');

// Updated: Generic function to start fly-in animation
function startCameraAnimation(targetObject, zoomOffset) {
    if (isAnimatingCamera || isAnimatingCameraBack) {
        console.log("Animation start ignored: Already animating.");
        return;
    }

    console.log(`Attempting to start fly-in animation towards ${targetObject.name}`); // Log start
    initialCameraPosition.copy(camera.position);
    targetOrbitTarget = controls.target.clone();

    currentAnimationTargetObject = targetObject;

    const direction = new THREE.Vector3();
    targetObject.getWorldPosition(direction); 
    cameraAnimationTarget.copy(direction); 
    direction.sub(camera.position).normalize().multiplyScalar(-zoomOffset); // Fixed direction calculation (normalize BEFORE multiply)
    cameraAnimationTarget.add(direction); 
    // Ensure target isn't too close to the origin if target is origin (like sun)
    if (targetObject === sunMesh && cameraAnimationTarget.lengthSq() < 1) {
         console.warn("Calculated target too close to origin for Sun, adjusting.");
         cameraAnimationTarget.set(0, 1, zoomOffset); // Adjust fallback for sun
    }

    console.log("Calculated target position:", cameraAnimationTarget); // Log target position

    controls.target.copy(targetObject.position); // Point controls at the object center
    controls.enabled = false;
    isAnimatingCamera = true;
    console.log("isAnimatingCamera set to true. Controls disabled."); // Log state change
}

// Function to show the About Me overlay
function showAboutOverlay() {
    console.log("Attempting to show About Overlay...");
    if (!aboutOverlay || !aboutOverlayContent) {
        console.error("About Overlay elements not found!");
        return;
    }
    console.log("Populating About Overlay content.");
    aboutOverlayContent.innerHTML = aboutMeContent.text;
    aboutOverlay.classList.add('visible');
    console.log("Added 'visible' class to overlay.");
    controls.enabled = false; // Keep disabled
    console.log("OrbitControls remain disabled.");
}

// Function to start exit animation (from About overlay)
window.startExitAnimation = function() {
    if (isAnimatingCameraBack || !aboutOverlay.classList.contains('visible')) return;
    console.log("Starting exit animation from About Me...");
    if (aboutOverlay) {
        aboutOverlay.classList.remove('visible');
        console.log("Removed 'visible' class from overlay immediately.");
    }
    flyBackTriggeredBy = 'about'; // Set trigger type
    isAnimatingCameraBack = true;
    controls.enabled = false;
};

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

    // --- PAUSE PLANET ---
    pausedPlanet = planets.find(p => p.name === data.id);
    if (pausedPlanet) {
        pausedPlanet.isPaused = true;
        console.log(`>>> Pausing planet: ${pausedPlanet.name} (isPaused set to ${pausedPlanet.isPaused})`); // Log pause
    } else {
        console.warn(`Could not find planet ${data.id} to pause.`);
    }
    // --- END PAUSE PLANET ---
}

function onMouseClick(event) {
    // Don't process clicks if an overlay/modal is visible or camera is animating
    if (isAnimatingCamera || isAnimatingCameraBack || 
        (aboutOverlay && aboutOverlay.classList.contains('visible')) ||
        (projectModal && projectModal.style.display === 'block') || 
        (document.getElementById('contact-modal') && document.getElementById('contact-modal').style.display === 'block')) {
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
                startCameraAnimation(clickedNamedObject, 6.0);
            } else if (clickedNamedObject.name === "ContactRocket") {
                console.log("Contact rocket clicked!");
                showContactModal();
            } else if (clickedNamedObject.userData && clickedNamedObject.userData.id?.startsWith('project-')) {
                console.log(`Clicked on Project Planet: ${clickedNamedObject.name}`); // Log planet click specifically
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
    // Don't show hover effects if an overlay/modal is active or camera is animating
    if (isAnimatingCamera || isAnimatingCameraBack ||
        (aboutOverlay && aboutOverlay.classList.contains('visible')) ||
        (projectModal && projectModal.style.display === 'block') ||
        (document.getElementById('contact-modal') && document.getElementById('contact-modal').style.display === 'block')) { // Also check contact modal
        tooltipElement.style.display = 'none'; // Ensure tooltip is hidden
        canvas.style.cursor = defaultCursor; // Reset cursor
        return;
    }

    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check intersections with interactive objects
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        let objectName = '';

        if (hoveredObject.name === "AboutMeSun") {
            objectName = "About Me";
        } else if (hoveredObject.name === "ContactRocket") {
            objectName = "Contact Me";
        } else if (hoveredObject.userData && hoveredObject.userData.name) {
            objectName = hoveredObject.userData.name;
        }

        if (objectName) {
            tooltipElement.style.display = 'block';
            tooltipElement.textContent = objectName;
            tooltipElement.style.left = (event.clientX + 15) + 'px';
            tooltipElement.style.top = (event.clientY + 10) + 'px';
            canvas.style.cursor = 'pointer';
        } else {
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

    // Handle Camera Animation Forward
    if (isAnimatingCamera) {
        console.log("Animating camera fly-in..."); // Log loop entry
        camera.position.lerp(cameraAnimationTarget, cameraAnimationSpeed * delta);
        // controls.update(); // <<< REMOVED from inside loop
        const distanceToTarget = camera.position.distanceTo(cameraAnimationTarget);
        console.log(`  Distance to target: ${distanceToTarget.toFixed(2)}`); // Log distance

        if (distanceToTarget < 0.5) {
            console.log("  Reached target!"); // Log condition met
            isAnimatingCamera = false;
            camera.position.copy(cameraAnimationTarget);
            controls.update(); // Update controls ONCE after animation finishes

            if (currentAnimationTargetObject) {
                 console.log(`  Animation finished for: ${currentAnimationTargetObject.name}`);
                if (currentAnimationTargetObject.name === "AboutMeSun") {
                    showAboutOverlay();
                } else if (currentAnimationTargetObject.userData && currentAnimationTargetObject.userData.id?.startsWith('project-')) {
                    showProjectModal(currentAnimationTargetObject.userData);
                }
                // Don't clear target object yet if it's a planet, needed for resuming
                // currentAnimationTargetObject = null; 
            } else {
                 console.warn("  Camera animation finished but target object was null.");
            }
        }
    }
    // Handle Camera Animation Backward
    else if (isAnimatingCameraBack) {
        console.log("Animating camera fly-back..."); // Add log
        camera.position.lerp(initialCameraPosition, cameraAnimationSpeed * delta);
        // Optionally lerp target back for smoother look?
        // controls.target.lerp(targetOrbitTarget, cameraAnimationSpeed * delta);
        controls.target.copy(sunMesh.position); // Simple look at sun for now
        controls.update(); 
        const distanceToStart = camera.position.distanceTo(initialCameraPosition);

        if (distanceToStart < 0.5) { // Reached previous position
            console.log("Fly-back animation finished.");
            isAnimatingCameraBack = false;
            camera.position.copy(initialCameraPosition); 
            
            // --- RESUME PLANET & HIDE MODAL --- 
            if (flyBackTriggeredBy === 'project') {
                if (projectModal) projectModal.style.display = 'none';
                console.log("Hid project modal after fly-back.");
                // Resume the paused planet
                if (pausedPlanet) {
                    pausedPlanet.isPaused = false;
                    console.log(`Resumed planet: ${pausedPlanet.name}`);
                    pausedPlanet = null; // Clear the paused planet reference
                }
            }
            // Clear trigger for both cases
            flyBackTriggeredBy = null;
            // --- END RESUME PLANET --- 
            
            // Restore original controls target and enable controls
            if (targetOrbitTarget) {
                controls.target.copy(targetOrbitTarget);
            }
            controls.enabled = true; 
            controls.update(); 
            console.log("Controls enabled after fly-back.");
            // Clear the target object reference after fly-back completes
            currentAnimationTargetObject = null;
        }
    }
    // Only update controls based on user input if no camera animation is active
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
// Updated to handle project modal fly-back trigger
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === 'project-modal') {
        // Trigger fly-back animation for project modal
        console.log("Closing project modal - initiating fly-back.");
        flyBackTriggeredBy = 'project'; // Set trigger type
        isAnimatingCameraBack = true;
        controls.enabled = false;
        // DO NOT hide the modal here, animate loop will hide it
    } else if (modalId === 'contact-modal') {
        // Close contact modal instantly and re-enable controls (if appropriate)
        modal.style.display = 'none';
        console.log(`Closed modal instantly: ${modalId}`);
        // Re-enable controls only if nothing else requires them disabled
        if (!isAnimatingCamera && !isAnimatingCameraBack && !(aboutOverlay && aboutOverlay.classList.contains('visible')) && !(projectModal && projectModal.style.display === 'block') ) {
             controls.enabled = true;
             console.log("Controls re-enabled after contact modal close.");
        }
    } else {
        // Handle other modals instantly if needed
        modal.style.display = 'none';
    }
};

// Event listener for closing overlay/modal by clicking background
window.addEventListener('click', (event) => {
    if (aboutOverlay && aboutOverlay.classList.contains('visible') && event.target === aboutOverlay) {
        startExitAnimation(); // Uses dedicated function for About fly-back
    }
    if (projectModal && projectModal.style.display === 'block' && event.target === projectModal) {
        closeModal('project-modal'); // Calls updated closeModal
    }
    const contactModal = document.getElementById('contact-modal');
    if (contactModal && contactModal.style.display === 'block' && event.target === contactModal) {
        closeModal('contact-modal'); // Calls updated closeModal
    }
});

// Function to show Contact Modal
function showContactModal() {
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        console.log("Showing contact modal."); // Add log
        contactModal.style.display = 'block';
    }
} 