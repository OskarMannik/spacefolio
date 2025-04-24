if (typeof THREE === 'undefined') {
    console.error('THREE.js library not loaded!');
}

const aboutMeContent = {
    title: "About Me",
    text: `<p>Hello! We are Oskar and Philip, passionate developers exploring the vast universe of technology.</p>
           <p>We love creating exciting projects and are always looking for new challenges.</p>
           <p>This portfolio showcases some constellations of our work. Feel free to explore!</p>`
};

const projectsData = [
    {
        id: "project-1",
        name: "PortfolioX",
        texture: 'assets/textures/planet1.jpeg', 
        description: "A foundational project demonstrating core web technologies and interactive 3D elements.",
        tech: "JavaScript, Three.js, HTML, CSS",
        liveUrl: "https://oskarmannik.github.io/PortXFolio-hack/", 
        codeUrl: "#", 
        image: 'assets/imgs/project1.png' 
    },
    {
        id: "project-2",
        name: "DataSphere Navigator",
        texture: 'assets/textures/planet2.jpeg', 
        description: "An interactive visualization tool that allows users to explore complex datasets through a 3D interface, revealing hidden patterns and insights.",
        tech: "React, D3.js, Three.js, Node.js",
        liveUrl: "#",
        codeUrl: "#",
        image: 'assets/imgs/project2.png'
    },
    {
        id: "project-3",
        name: "EcoTracker Live",
        texture: 'assets/textures/planet3.jpg', 
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

];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 28; 

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;  
controls.maxDistance = 100; 
let originalEnableDamping = controls.enableDamping; 

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 300);
pointLight.position.set(0, 0, 0); 
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();

function addStarfield() {
    const starVertices = [];
    const starColors = [];
    const starSizes = [];
    const baseColor = new THREE.Color(0xffffff);

    for (let i = 0; i < 15000; i++) { 
        const x = THREE.MathUtils.randFloatSpread(400); 
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

const sunGeometry = new THREE.SphereGeometry(2.5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffff00, 
    emissiveIntensity: 0.4,
    map: textureLoader.load('assets/textures/sun.jpeg'),
    color: 0xffff00
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.name = "AboutMeSun"; 
sunMesh.userData = aboutMeContent; 
scene.add(sunMesh);

const planets = []; 
const planetGeometry = new THREE.SphereGeometry(0.8, 32, 32); 
const orbitRadiusBase = 8;
const angleStep = (Math.PI * 2) / projectsData.length;

projectsData.forEach((project, index) => {
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: project.texture ? textureLoader.load(project.texture) : null,
        color: !project.texture ? Math.random() * 0xffffff : 0xffffff 
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    const angle = angleStep * index;
    const orbitRadius = orbitRadiusBase + index * 3; 
    planetMesh.position.x = Math.cos(angle) * orbitRadius;
    planetMesh.position.z = Math.sin(angle) * orbitRadius;
    planetMesh.position.y = THREE.MathUtils.randFloatSpread(1); 

    planetMesh.name = project.id; 
    planetMesh.userData = project; 
    planetMesh.orbitRadius = orbitRadius;
    planetMesh.angle = angle;
    planetMesh.orbitSpeed = 0.002 + Math.random() * 0.002; 

    scene.add(planetMesh);
    planets.push(planetMesh);
});


const loader = new THREE.GLTFLoader();

let loadedRocket = null; 

let rocketVelocity = new THREE.Vector3(THREE.MathUtils.randFloatSpread(1), 0, THREE.MathUtils.randFloatSpread(1)).normalize(); // Start with random horizontal direction
const ROCKET_MAX_SPEED = 0.008;    
const ROCKET_STEERING_FORCE = 0.0002; 
const ROCKET_TURN_SPEED = 0.025;   
const WANDER_RADIUS = 12;        
const WANDER_Y_RANGE = 2;        
const rocketYPosition = 8;       

const horizontalCorrectionQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
const reverseDirectionQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
const targetOrientation = new THREE.Quaternion(); 

loader.load(
	'assets/models/rocket.glb',

	function ( gltf ) {

		loadedRocket = gltf.scene;
        loadedRocket.name = "ContactRocket"; 

        const scale = 0.2; 
        loadedRocket.scale.set(scale, scale, scale);
        loadedRocket.quaternion.copy(horizontalCorrectionQuaternion).multiply(reverseDirectionQuaternion);

        loadedRocket.position.set(
            THREE.MathUtils.randFloatSpread(WANDER_RADIUS),
            rocketYPosition + THREE.MathUtils.randFloatSpread(WANDER_Y_RANGE),
            THREE.MathUtils.randFloatSpread(WANDER_RADIUS)
        );

		scene.add( loadedRocket );

        interactiveObjects.push(loadedRocket);
        console.log('Rocket model loaded and added to interactiveObjects.');

	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened loading the rocket model:', error );
	}
);

const interactiveObjects = [sunMesh, ...planets];

const defaultCursor = 'grab'; 
canvas.style.cursor = defaultCursor;

let isAnimatingCamera = false;
let cameraAnimationTarget = new THREE.Vector3();
const cameraAnimationSpeed = 1.5; 
let targetOrbitTarget = null;
let initialCameraPosition = new THREE.Vector3();
let isAnimatingCameraBack = false; 
let currentAnimationTargetObject = null; 
let flyBackTriggeredBy = null; 
let pausedPlanet = null; 

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const tooltipElement = document.getElementById('tooltip');
const aboutModal = document.getElementById('about-modal'); 
const aboutContentContainer = document.getElementById('about-overlay-content');
const projectModal = document.getElementById('project-modal');
const projectTitleEl = document.getElementById('project-title');
const projectImageEl = document.getElementById('project-image');
const projectDescriptionEl = document.getElementById('project-description');
const projectTechEl = document.getElementById('project-tech');
const projectLiveLinkEl = document.getElementById('project-live-link');
const projectCodeLinkEl = document.getElementById('project-code-link');
const contactModal = document.getElementById('contact-modal'); 

function startCameraAnimation(targetObject, zoomOffset) {
    if (isAnimatingCamera || isAnimatingCameraBack) {
        console.log("Animation start ignored: Already animating.");
        return;
    }
    
    console.log(`Attempting to start fly-in animation towards ${targetObject.name}`); 
    initialCameraPosition.copy(camera.position);
    targetOrbitTarget = controls.target.clone(); 
    originalEnableDamping = controls.enableDamping; 

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
    
    controls.enabled = false;
    controls.enableDamping = false; 
    isAnimatingCamera = true;
    console.log("isAnimatingCamera set to true. Controls and Damping disabled."); 
}

function showAboutModal() {
    console.log("Attempting to show About Modal...");
    if (!aboutModal || !aboutContentContainer) {
        console.error("About Modal elements not found!");
        return;
    }
    console.log("Populating About Modal content.");
    aboutContentContainer.innerHTML = aboutMeContent.text;
    aboutModal.style.display = 'block'; 
    console.log("Set 'display: block' for about-modal.");
    controls.enabled = false;
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
    controls.enabled = false; 
    console.log("Showing project modal. OrbitControls disabled.");
}

function showContactModal() {
    if (contactModal) {
        console.log("Showing contact modal.");
        contactModal.style.display = 'block';
        if (!isAnimatingCamera && !isAnimatingCameraBack) {
             controls.enabled = false; 
             console.log("Controls disabled while contact modal open.");
        } else {
             console.log("Keeping controls disabled (camera animating).")
        }
    }
}

// --- Raycasting and Interaction Logic (Refactored) ---
function handleInteraction(clientX, clientY) {
    let interactionOccurred = false; // Flag to track if interaction happened

    if (isAnimatingCamera || isAnimatingCameraBack ||
        (aboutModal && aboutModal.style.display === 'block') ||
        (projectModal && projectModal.style.display === 'block') ||
        (contactModal && contactModal.style.display === 'block')) {
        return interactionOccurred; // Return false if modals are open
    }

    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
        let clickedNamedObject = null;
        for(let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            while (obj.parent && !interactiveObjects.includes(obj)) {
                obj = obj.parent;
            }
            if (interactiveObjects.includes(obj)) {
                clickedNamedObject = obj;
                break;
            }
        }

        if(clickedNamedObject){
            interactionOccurred = true; // Mark interaction as happening
            if (clickedNamedObject.name === "AboutMeSun") {
                if (pausedPlanet) {
                    pausedPlanet.isPaused = false;
                    pausedPlanet = null;
                }
                startCameraAnimation(clickedNamedObject, 6.0);
            } else if (clickedNamedObject.name === "ContactRocket") {
                 if (pausedPlanet) {
                    pausedPlanet.isPaused = false;
                    pausedPlanet = null;
                }
                startCameraAnimation(clickedNamedObject, 3.0);
            } else if (clickedNamedObject.userData && clickedNamedObject.userData.id?.startsWith('project-')) {
                if (pausedPlanet && pausedPlanet !== clickedNamedObject) {
                    pausedPlanet.isPaused = false;
                }
                pausedPlanet = clickedNamedObject;
                if(pausedPlanet) {
                    pausedPlanet.isPaused = true;
                } else {
                     
                }
                startCameraAnimation(clickedNamedObject, 3.0);
            }
        } else {
            interactionOccurred = false; // No named object clicked
        }
    } else {
         interactionOccurred = false; // No intersection
    }
    return interactionOccurred; // Return the flag
}

// --- Event Listeners ---

// Mouse Click Listener (Uses refactored logic)
function onMouseClick(event) {
    handleInteraction(event.clientX, event.clientY);
}
window.addEventListener('click', onMouseClick, false);

// Touch End Listener (for mobile taps)
function onTouchEnd(event) {
    if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        const interactionHappened = handleInteraction(touch.clientX, touch.clientY);
        
        // Only prevent default if a 3D interaction occurred
        if (interactionHappened) {
            event.preventDefault(); 
        }
    }
}
window.addEventListener('touchend', onTouchEnd, false);

function onMouseMove(event) {
    if (isAnimatingCamera || isAnimatingCameraBack ||
        (aboutModal && aboutModal.style.display === 'block') || // Check aboutModal
        (projectModal && projectModal.style.display === 'block') ||
        (contactModal && contactModal.style.display === 'block')) { // Check contactModal
        tooltipElement.style.display = 'none';
        canvas.style.cursor = defaultCursor;
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
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
                const boundingBox = new THREE.Box3().setFromObject(hoveredNamedObject); 
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                const topCenterOffset = new THREE.Vector3(0, size.y / 2 + 0.6, 0); 
                const tooltipAnchor3D = center.add(topCenterOffset);
                
                const projectedPosition = tooltipAnchor3D.project(camera); 

                const isVisible = Math.abs(projectedPosition.x) <= 1 && Math.abs(projectedPosition.y) <= 1 && projectedPosition.z < 1;

                if (isVisible) {
                    const screenX = (projectedPosition.x + 1) / 2 * window.innerWidth;
                    const screenY = (-projectedPosition.y + 1) / 2 * window.innerHeight;
                    
                    tooltipElement.textContent = objectName;
                    tooltipElement.style.left = `${screenX}px`;
                    tooltipElement.style.top = `${screenY}px`;
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
            tooltipElement.style.display = 'none';
            canvas.style.cursor = defaultCursor;
        }

    } else {
        tooltipElement.style.display = 'none';
        canvas.style.cursor = defaultCursor;
    }
}
window.addEventListener('mousemove', onMouseMove, false);

const clock = new THREE.Clock(); 

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); 

    if (isAnimatingCamera) {
        console.log("Animating camera fly-in...");
        camera.position.lerp(cameraAnimationTarget, cameraAnimationSpeed * delta);
        const distanceToTarget = camera.position.distanceTo(cameraAnimationTarget);
        console.log(`  Distance to target: ${distanceToTarget.toFixed(2)}`);

        if (distanceToTarget < 0.5) {
            console.log("  Reached target!");
            isAnimatingCamera = false;
            camera.position.copy(cameraAnimationTarget); 

            if (currentAnimationTargetObject) {
                 console.log(`  Animation finished for: ${currentAnimationTargetObject.name}`);
                 const targetToShow = currentAnimationTargetObject;
                 requestAnimationFrame(() => {
                     if (targetToShow.name === "AboutMeSun") {
                         showAboutModal(); 
                     } else if (targetToShow.userData && targetToShow.userData.id?.startsWith('project-')) {
                         showProjectModal(targetToShow.userData);
                     } else if (targetToShow.name === "ContactRocket") {
                         showContactModal();
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

            if (targetOrbitTarget) {
                controls.target.copy(targetOrbitTarget);
            }
            controls.enabled = true;
            
            controls.enableDamping = originalEnableDamping;
            controls.update();
            
            currentAnimationTargetObject = null;
        }
    }
    else {
        if (controls.enabled) {
            controls.update();
        }
    }

    if (loadedRocket) {
        let steer = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(2) - 1, // -1 to 1
            THREE.MathUtils.randFloatSpread(2) - 1, // -1 to 1  (Allows vertical wandering)
            THREE.MathUtils.randFloatSpread(2) - 1  // -1 to 1
        );
        steer.normalize();
        steer.multiplyScalar(ROCKET_STEERING_FORCE);

        
        const distanceCenter = loadedRocket.position.distanceTo(new THREE.Vector3(0, rocketYPosition, 0));
        if (distanceCenter > WANDER_RADIUS) {
            let steerToCenter = new THREE.Vector3(0, rocketYPosition, 0).sub(loadedRocket.position); // Target point is center at base height
            steerToCenter.normalize();
            steer.x += steerToCenter.x * ROCKET_STEERING_FORCE * 2; 
            steer.z += steerToCenter.z * ROCKET_STEERING_FORCE * 2;
            steer.y += steerToCenter.y * ROCKET_STEERING_FORCE * 0.5; 
        }
        
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
        

        rocketVelocity.add(steer);
        rocketVelocity.clampLength(0, ROCKET_MAX_SPEED); // Limit speed

        loadedRocket.position.add(rocketVelocity);

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

    sunMesh.rotation.y += 0.001;

    planets.forEach(planet => {
         if (planet.isPaused) {
             console.log(`Skipping animation for paused planet: ${planet.name} at x=${planet.position.x.toFixed(2)}`); 
             return; 
         }

        if (planet instanceof THREE.Mesh && typeof planet.angle !== 'undefined' && typeof planet.orbitSpeed !== 'undefined' && typeof planet.orbitRadius !== 'undefined') {
            
        planet.angle += planet.orbitSpeed;
        planet.position.x = Math.cos(planet.angle) * planet.orbitRadius;
        planet.position.z = Math.sin(planet.angle) * planet.orbitRadius;
            
            if (planet.children.length > 0) { 
                 planet.children[0].rotation.y += 0.005; 
            } else {
                 planet.rotation.y += 0.005; 
            }
        }
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

animate();

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    console.log(`closeModal called for: ${modalId}`);

    if (modalId === 'project-modal' || modalId === 'about-modal' || modalId === 'contact-modal') {
        if (isAnimatingCameraBack) {
            console.log(`${modalId} close ignored: fly-back already in progress.`);
            return;
        }
        console.log(`>>> ${modalId} close: Hiding modal AND Initiating fly-back.`);
        modal.style.display = 'none';
        // ----------------------------- 
        if (modalId === 'project-modal') { flyBackTriggeredBy = 'project'; }
        else if (modalId === 'about-modal') { flyBackTriggeredBy = 'about'; }
        else if (modalId === 'contact-modal') { flyBackTriggeredBy = 'contact'; }

        isAnimatingCameraBack = true;
        controls.enabled = false;
    } else {
        modal.style.display = 'none';
        console.log(`Closed modal instantly (default case): ${modalId}`);
    }
};

// --- Attach Modal Close Listeners (NEW) ---

// Function to handle close action for both click and touch
function handleCloseEvent(event, modalId) {
    event.stopPropagation(); // Prevent event bubbling up
    if (event.type === 'touchend') {
        event.preventDefault(); // Prevent potential duplicate click
    }
    closeModal(modalId);
}

// Attach listeners to close buttons
document.querySelectorAll('.modal .close-button').forEach(button => {
    const modal = button.closest('.modal');
    if (modal) {
        const modalId = modal.id;
        button.addEventListener('click', (e) => handleCloseEvent(e, modalId));
        button.addEventListener('touchend', (e) => handleCloseEvent(e, modalId));
    }
});

// Attach listeners to modal backgrounds
[aboutModal, projectModal, contactModal].forEach(modal => {
    if (modal) {
        const modalId = modal.id;
        // Listener for click on background
        modal.addEventListener('click', (event) => {
            // Check if the click is directly on the modal background
            if (event.target === modal) {
                handleCloseEvent(event, modalId);
            }
        });
        // Listener for touch on background
        modal.addEventListener('touchend', (event) => {
             // Check if the touch end is directly on the modal background
            if (event.target === modal) {
                handleCloseEvent(event, modalId);
            }
        });
    }
});