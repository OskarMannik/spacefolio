// Galaxy Portfolio Logic

// Ensure THREE is available globally from the script tag
if (typeof THREE === 'undefined') {
    console.error('THREE.js library not loaded!');
}

// Scene setup
const scene = new THREE.Scene();
// No background color, we use starfield

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Renderer setup
const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls setup
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 50;

// Lighting (Using increased intensity from previous debugging)
const pointLight = new THREE.PointLight(0xffffff, 2.5); 
pointLight.position.set(15, 15, 15);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(pointLight, ambientLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Function to add stars
function addStarfield() {
    const starVertices = [];
    const starColors = []; // Array for colors
    const starSizes = [];  // Array for sizes

    const baseColor = new THREE.Color(0xffffff);

    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(200);
        const y = THREE.MathUtils.randFloatSpread(200);
        const z = THREE.MathUtils.randFloatSpread(200);
        starVertices.push(x, y, z);

        // Add slight color variation
        const color = baseColor.clone();
        color.lerp(new THREE.Color(0xaaaaff), Math.random() * 0.3); // Lerp towards blueish
        starColors.push(color.r, color.g, color.b);

        // Add size variation
        starSizes.push(Math.random() * 1.5 + 0.5); // Random size between 0.5 and 2.0 (relative)
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({ 
        // color: 0xffffff, // Use vertex colors instead
        vertexColors: true,
        size: 0.1, // Base size, will be multiplied by attribute
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Function to add Nebulae (REMOVING for now)
/*
function addNebulae() {
    const nebulaTexture = textureLoader.load('...'); // Placeholder removed
    const nebulaMaterial = new THREE.MeshBasicMaterial({...});
    // ... rest of nebula creation ...
}
*/

// --- Label Creation ---
function createLabelSprite(text, fontsize = 90) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const font = `bold ${fontsize}px Arial`; // Make font bold
    context.font = font;

    // Measure text width to set canvas size
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    const padding = 20;
    canvas.width = textWidth + padding * 2;
    canvas.height = fontsize + padding * 2;

    // Background
    context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black background
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Optional: Rounded corners for background
    // context.beginPath();
    // context.roundRect(0, 0, canvas.width, canvas.height, 15); // Adjust radius
    // context.fillStyle = "rgba(0, 0, 0, 0.5)";
    // context.fill();

    // Text
    context.font = font;
    context.fillStyle = "rgba(255, 255, 255, 0.95)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);

    // Scale sprite
    const aspect = canvas.width / canvas.height;
    sprite.scale.set(aspect * 2.5, 2.5, 1); // Slightly larger scale

    sprite.visible = false; 
    return sprite;
}

// Placeholder Portfolio Nodes (Planets/Stars)
const planets = []; // Array holds { mesh, name, label } 
const nodeGeometry = new THREE.SphereGeometry(0.8, 32, 32);

// --- About Node ---
const aboutTexture = textureLoader.load('assets/textures/gravel_road_diff_4k.jpg'); // Use local texture with underscore
const aboutMaterial = new THREE.MeshStandardMaterial({ 
    map: aboutTexture,
    color: 0xffd700 // Keep fallback color in case texture fails
}); 
const aboutNode = new THREE.Mesh(nodeGeometry, aboutMaterial);
aboutNode.position.set(-5, 0, 0);
aboutNode.name = "About";
const aboutLabel = createLabelSprite("About");
aboutLabel.position.set(-5, 1.5, 0); // Position label above planet
scene.add(aboutNode, aboutLabel);
planets.push({ mesh: aboutNode, name: "About", label: aboutLabel });

// --- Projects Node ---
// No texture specified yet
const projectsMaterial = new THREE.MeshStandardMaterial({ 
    // map: null,
    color: 0x00ffff // Fallback color
}); 
const projectsNode = new THREE.Mesh(nodeGeometry, projectsMaterial);
projectsNode.position.set(5, 0, 0);
projectsNode.name = "Projects";
const projectsLabel = createLabelSprite("Projects");
projectsLabel.position.set(5, 1.5, 0); // Position label above planet
scene.add(projectsNode, projectsLabel);
planets.push({ mesh: projectsNode, name: "Projects", label: projectsLabel });

// --- Skills Node ---
// No texture specified yet
const skillsMaterial = new THREE.MeshStandardMaterial({ 
    // map: null,
    color: 0xff69b4 // Fallback color
}); 
const skillsNode = new THREE.Mesh(nodeGeometry, skillsMaterial);
skillsNode.position.set(0, 5, -5);
skillsNode.name = "Skills";
const skillsLabel = createLabelSprite("Skills");
skillsLabel.position.set(0, 6.5, -5); // Position label above planet
scene.add(skillsNode, skillsLabel);
planets.push({ mesh: skillsNode, name: "Skills", label: skillsLabel });

// Raycasting for Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentVisibleLabel = null;

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // Important: Check intersection with planet meshes, not labels
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    // Hide previously visible label
    if (currentVisibleLabel) {
        currentVisibleLabel.visible = false;
        currentVisibleLabel = null;
    }

    if (intersects.length > 0) {
        const clickedPlanetMesh = intersects[0].object;
        // Find the corresponding planet data object
        const planetData = planets.find(p => p.mesh === clickedPlanetMesh);
        
        if (planetData && planetData.label) {
            planetData.label.visible = true;
            currentVisibleLabel = planetData.label;
            console.log(`Clicked on: ${planetData.name}, showing label.`);
            // TODO: Add logic to display detailed content panel here
        }
    } else {
        console.log("Clicked on background.");
        // Clicked on background, label already hidden above
    }
}

// Add Click Listener
window.addEventListener('click', onMouseClick, false);

// Initial setup calls
addStarfield();
// addNebulae(); // REMOVED call

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls 
    controls.update();

    // Rotate planets
    planets.forEach(planet => {
        planet.mesh.rotation.y += 0.002; // Slow rotation
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// Initial call to start animation
animate();

console.log("Applied texture to About planet. Others use fallback color."); 