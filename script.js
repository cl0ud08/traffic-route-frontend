// Initialize the map
const map = L.map('map', {
    center: [28.6139, 77.2090], // Center on Delhi
    zoom: 11,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: true,
    touchZoom: true,
    zoomControl: true
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const routeLayer = L.layerGroup().addTo(map);
const markers = [];

// Locations based on routes with improved coordinates
const locations = {
    'Delhi': [28.6139, 77.2090],
    'Connaught Place': [28.6315, 77.2167],
    'Rajiv Chowk': [28.6328, 77.2197],
    'Karol Bagh': [28.6517, 77.1906],
    'Ghaziabad': [28.6692, 77.4538],
    'Sahibabad': [28.6863, 77.3631],
    'Vasundhara': [28.6849, 77.3436],
    'Indirapuram': [28.6289, 77.3708],
    'Noida': [28.5355, 77.3910],
    'Sector 62': [28.6283, 77.3574],
    'Sector 50': [28.5708, 77.3685],
    'Sector 15': [28.5873, 77.3221],
    'Noida Sector 37': [28.5673, 77.3200],

    'South Delhi': [28.5245, 77.1855],
    'Saket': [28.5244, 77.2104],
    'Hauz Khas': [28.5494, 77.2001],
    'Okhla': [28.5355, 77.2754],
    'Delhi-Ghaziabad Border': [28.6504, 77.2818],
    'Cross the DND Flyway': [28.5708, 77.2983],
    'Sector 18': [28.5675, 77.3260],
    'Sector 25': [28.5797, 77.3348],

    'India Gate': [28.6129, 77.2295],
    'Greater Noida': [28.4744, 77.5030],
    'Pari Chowk': [28.4713, 77.5144],
    'Knowledge Park': [28.4690, 77.5155],
    'Sector 63': [28.6283, 77.3574]
};

// Example traffic data
const trafficAreas = {
    'Connaught Place': 'red', 
    'Rajiv Chowk': 'red',
    'Karol Bagh': 'red',
    'Ghaziabad': 'red',
    'Indirapuram': 'red',
    'Saket': 'red',
    'India Gate': 'red',
    'Greater Noida': 'red',
    'Pari Chowk': 'red',
    'Knowledge Park': 'red',
    'Sector 62': 'red',
    'Sector 50': 'red',
    'Sector 15': 'red',
    
};
// Route definitions
// Route 1: Via NH 24 (Now NH 9)
const route1 = [
    'Delhi',
    'Connaught Place',
    'Rajiv Chowk',
    'Karol Bagh',
    'Ghaziabad',
    'Sahibabad',
    'Vasundhara',
    'Indirapuram',
    'Noida',
    'Sector 62',
    'Sector 50',
    'Sector 15',
    'Noida Sector 37'
];

// Route 2: Via DND Flyway
const route2 = [
    'Delhi',
    'South Delhi',
    'Saket',
    'Hauz Khas',
    'Okhla',
    'Delhi-Ghaziabad Border',
    'Cross the DND Flyway',
    'Noida',
    'Sector 18',
    'Sector 25',
    'Noida Sector 37'
];

// Route 3: Via Yamuna Expressway
const route3 = [
    'Delhi',
    'Connaught Place',
    'India Gate',
    'Greater Noida',
    'Pari Chowk',
    'Knowledge Park',
    'Noida',
    'Sector 63',
    'Noida Sector 37'
];

const graph = {
    'Delhi': { 'Connaught Place': 2, 'South Delhi': 5, 'India Gate': 1 },
    
    // Route 1: Via NH 24 (Now NH 9)
    'Connaught Place': { 'Rajiv Chowk': 1, 'Delhi': 2 },
    'Rajiv Chowk': { 'Karol Bagh': 2, 'Connaught Place': 1 },
    'Karol Bagh': { 'Ghaziabad': 15, 'Rajiv Chowk': 2 },
    'Ghaziabad': { 'Sahibabad': 5, 'Karol Bagh': 15 },
    'Sahibabad': { 'Vasundhara': 5, 'Ghaziabad': 5 },
    'Vasundhara': { 'Indirapuram': 5, 'Sahibabad': 5 },
    'Indirapuram': { 'Noida': 7, 'Vasundhara': 5 },
    'Noida': { 'Sector 62': 5, 'Indirapuram': 7, 'Sector 18': 5 },
    'Sector 62': { 'Sector 50': 5, 'Noida': 5 },
    'Sector 50': { 'Sector 15': 5, 'Sector 62': 5 },
    'Sector 15': { 'Noida Sector 37': 10, 'Sector 50': 5 },
    'Noida Sector 37': { 'Sector 15': 10 },

    // Route 2: Via DND Flyway
    'South Delhi': { 'Saket': 10, 'Hauz Khas': 8, 'Delhi': 5 },
    'Saket': { 'Hauz Khas': 4, 'South Delhi': 10 },
    'Hauz Khas': { 'Okhla': 7, 'Saket': 4 },
    'Okhla': { 'Delhi-Ghaziabad Border': 5, 'Hauz Khas': 7 },
    'Delhi-Ghaziabad Border': { 'Cross the DND Flyway': 3, 'Okhla': 5 },
    'Cross the DND Flyway': { 'Noida': 5, 'Delhi-Ghaziabad Border': 3 },
    'Sector 18': { 'Sector 25': 5, 'Noida': 5 },
    'Sector 25': { 'Noida Sector 37': 15, 'Sector 18': 5 },

    // Route 3: Via Yamuna Expressway
    'India Gate': { 'Greater Noida': 20, 'Delhi': 1 },
    'Greater Noida': { 'Pari Chowk': 10, 'India Gate': 20 },
    'Pari Chowk': { 'Knowledge Park': 2, 'Greater Noida': 10 },
    'Knowledge Park': { 'Sector 63': 5, 'Pari Chowk': 2 },
    'Sector 63': { 'Noida Sector 37': 7, 'Knowledge Park': 5 },
};

// Priority Queue implementation
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        this.items.push({ element, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }
    dequeue() {
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}

// Dijkstra's Algorithm
// Dijkstra's Algorithm

// Function to update sidebar with locations based on route
function updateSidebarLocations(route) {
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = ''; // Clear the list

    route.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location;
        if (trafficAreas[location]) {
            li.style.color = trafficAreas[location];
        }
        li.addEventListener('click', () => {
            map.setView(locations[location], 14);
        });
        locationList.appendChild(li);
    });
}

// Function to update sidebar active location
function updateSidebarActiveLocation(location) {
    const items = document.querySelectorAll('#locationList li');
    items.forEach(item => {
        if (item.textContent === location) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Function to animate marker
// Function to animate marker with smaller size
// Function to animate marker with smooth transitions
function animateMarker(latLngs, duration, marker) {
    const startLatLng = L.latLng(latLngs[0]);
    const endLatLng = L.latLng(latLngs[1]);

    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress < 1) {
            const currentLatLng = L.latLng([
                startLatLng.lat + (endLatLng.lat - startLatLng.lat) * easeInOutCubic(progress),
                startLatLng.lng + (endLatLng.lng - startLatLng.lng) * easeInOutCubic(progress)
            ]);
            marker.setLatLng(currentLatLng);
            requestAnimationFrame(animate);
        } else {
            marker.setLatLng(endLatLng);
        }
    }

    requestAnimationFrame(animate);
}

// Easing function for smooth animation
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}


// Function to update route step-by-step with smaller marker size and path width
function updateRouteStepByStep(route, trafficHighlight = false) {
    routeLayer.clearLayers();
    markers.forEach(marker => marker.remove());
    markers.length = 0;

    let index = 0;

    function nextStep() {
        if (index < route.length) {
            const currentLoc = route[index];
            const nextLoc = route[index+1];

            if (trafficHighlight && trafficAreas[currentLoc]) {
                showAlert(`Traffic detected at ${currentLoc}. Consider rerouting!`);
            } else {
                closeAlert();
            }

            // Marker options with car icon
            const carIcon = L.icon({
                iconUrl: 'png/location.png', // Path to your car icon image
                iconSize: [32, 32], // Adjust size as needed
                iconAnchor: [16, 32], // Anchor position
                popupAnchor: [0, -32] // Popup position
            });

            const marker = L.marker([locations[currentLoc][0], locations[currentLoc][1]], { icon: carIcon }).addTo(map);
            marker.bindPopup(currentLoc).openPopup();
            markers.push(marker);

            updateSidebarActiveLocation(currentLoc);

            // Polyline options with smaller width
            let polylineOptions = {
                color: trafficAreas[currentLoc] || 'blue',
                weight: 8, // Smaller width
                opacity: 0.7,
                dashArray: '5, 10'
            };

            if (trafficHighlight && trafficAreas[currentLoc]) {
                polylineOptions.color = trafficAreas[currentLoc];
                polylineOptions.weight = 8; // Smaller width
                polylineOptions.dashArray = '';
            }

            if (nextLoc) {
                const latLngs = [locations[currentLoc], locations[nextLoc]];
                L.polyline(latLngs, polylineOptions).addTo(routeLayer);

                animateMarker(latLngs, 1000, marker);
            }

            index++;
            setTimeout(nextStep, 1000);
        }
    }

    nextStep();
}// Function to display alerts for traffic
// Function to display alerts for traffic
function showAlert(message) {
    let alertDiv = document.getElementById('trafficAlert');
    if (!alertDiv) {
        alertDiv = document.createElement('div');
        alertDiv.id = 'trafficAlert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.bottom = '10px';
        alertDiv.style.left = '10px';
        alertDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        alertDiv.style.color = 'white';
        alertDiv.style.padding = '10px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.zIndex = 1000;
        document.body.appendChild(alertDiv);
    }
    alertDiv.textContent = message;
}

// Function to close alerts
function closeAlert() {
    const alertDiv = document.getElementById('trafficAlert');
    if (alertDiv) {
        alertDiv.remove();
    }
}
// Function to filter out traffic congested areas from the graph
function getFilteredGraph() {
    let filteredGraph = { ...graph };

    // Remove traffic congested areas and their connections
    Object.keys(trafficAreas).forEach(location => {
        if (trafficAreas[location] === 'red') {
            delete filteredGraph[location];
            Object.keys(filteredGraph).forEach(node => {
                delete filteredGraph[node][location];
            });
        }
    });

    return filteredGraph;
}

// Function to find the shortest path considering traffic
function findShortestPath(start, end, algorithm) {
    let filteredGraph = getFilteredGraph();
    
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue();

    const computePath = (currentGraph) => {
        for (let node in currentGraph) {
            distances[node] = Infinity;
            prev[node] = null;
            pq.enqueue(node, Infinity);
        }
        distances[start] = 0;
        pq.enqueue(start, 0);

        while (!pq.isEmpty()) {
            let u = pq.dequeue().element;
            if (u === end) break;

            for (let neighbor in currentGraph[u]) {
                let alt = distances[u] + currentGraph[u][neighbor];
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    prev[neighbor] = u;
                    pq.enqueue(neighbor, alt);
                }
            }
        }

        let path = [];
        for (let at = end; at; at = prev[at]) {
            path.push(at);
        }
        return path.reverse();
    };

    let path = computePath(filteredGraph);

    while (path.some(location => trafficAreas[location] === 'red')) {
        filteredGraph = getFilteredGraph();
        path = computePath(filteredGraph);
    }

    return path;
}

function dijkstra(start, end) {
    let filteredGraph = getFilteredGraph();
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue();

    // Initialize distances and priority queue
    for (let node in filteredGraph) {
        distances[node] = Infinity;
        prev[node] = null;
        pq.enqueue(node, Infinity);
    }
    distances[start] = 0;
    pq.enqueue(start, 0);

    // Main loop for Dijkstra's algorithm
    while (!pq.isEmpty()) {
        let u = pq.dequeue().element;
        if (u === end) break;

        for (let neighbor in filteredGraph[u]) {
            let alt = distances[u] + filteredGraph[u][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = u;
                pq.enqueue(neighbor, alt);
            }
        }
    }

    // Reconstruct the path
    let path = [];
    for (let at = end; at; at = prev[at]) {
        path.push(at);
    }
    path.reverse();

    // Check for traffic congestion and recalculate if necessary
    while (path.some(location => trafficAreas[location] === 'red')) {
        filteredGraph = getFilteredGraph();
        path = computePath(filteredGraph);
    }

    return path;
}

// A* Algorithm
function aStar(start, end) {
    const heuristic = (a, b) => {
        const [latA, lngA] = locations[a];
        const [latB, lngB] = locations[b];
        return Math.sqrt((latA - latB) ** 2 + (lngA - lngB) ** 2);
    };

    let openSet = new PriorityQueue();
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    const computePath = (filteredGraph) => {
        for (let node in filteredGraph) {
            gScore[node] = Infinity;
            fScore[node] = Infinity;
            openSet.enqueue(node, Infinity);
        }
        gScore[start] = 0;
        fScore[start] = heuristic(start, end);
        openSet.enqueue(start, fScore[start]);

        while (!openSet.isEmpty()) {
            let current = openSet.dequeue().element;

            if (current === end) {
                let path = [];
                while (cameFrom[current]) {
                    path.push(current);
                    current = cameFrom[current];
                }
                path.push(start);
                return path.reverse();
            }

            for (let neighbor in filteredGraph[current]) {
                let tentative_gScore = gScore[current] + filteredGraph[current][neighbor];
                if (tentative_gScore < gScore[neighbor]) {
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentative_gScore;
                    fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
                    openSet.enqueue(neighbor, fScore[neighbor]);
                }
            }
        }

        return [];
    };

    let filteredGraph = getFilteredGraph();
    let path = computePath(filteredGraph);

    while (path.length === 0 || path.some(location => trafficAreas[location] === 'red')) {
        filteredGraph = getFilteredGraph();
        path = computePath(filteredGraph);
    }

    return path;
}

// Priority Queue implementation


// Event listeners for buttons
document.getElementById('route1Button').addEventListener('click', () => {
    updateRouteStepByStep(route1, true);
    updateSidebarLocations(route1);
});

document.getElementById('route2Button').addEventListener('click', () => {
    updateRouteStepByStep(route2, true);
    updateSidebarLocations(route2);
});

document.getElementById('route3Button').addEventListener('click', () => {
    updateRouteStepByStep(route3, true);
    updateSidebarLocations(route3);
});
document.getElementById('optimalButton').addEventListener('click', () => {
    const path = findShortestPath('Delhi', 'Noida Sector 37', 'dijkstra');
    updateRouteStepByStep(path, false);
    updateSidebarLocations(path);
});

document.getElementById('optimalButtonr').addEventListener('click', () => {
    const path = findShortestPath('Delhi', 'Noida Sector 37', 'aStar');
    updateRouteStepByStep(path, false);
    updateSidebarLocations(path);
});

document.getElementById('optimalButtonr').addEventListener('click', () => {
    const path = aStar('Delhi', 'Noida Sector 37');
    updateRouteStepByStep(path, false); // Set trafficHighlight to false
    updateSidebarLocations(path);
});

document.getElementById('route1Option').addEventListener('click', () => {
    updateRouteStepByStep(route1, true);
    updateSidebarLocations(route1);
});

document.getElementById('route2Option').addEventListener('click', () => {
    updateRouteStepByStep(route2, true);
    updateSidebarLocations(route2);
});

document.getElementById('route3Option').addEventListener('click', () => {
    updateRouteStepByStep(route3, true);
    updateSidebarLocations(route3);
});

// Function to scroll to active location in the sidebar
function scrollToActiveLocation() {
    const activeItem = document.querySelector('#locationList li.active');
    if (activeItem) {
        activeItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest' // Ensures the item is visible in the view
        });
    }
}

// Update function to include scrolling
function updateSidebarActiveLocation(location) {
    const items = document.querySelectorAll('#locationList li');
    items.forEach(item => {
        if (item.textContent === location) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    scrollToActiveLocation(); // Scroll to active location
}
/// Function to display alerts for traffic
function showAlert(message) {
    let alertDiv = document.getElementById('trafficAlert');
    if (!alertDiv) {
        alertDiv = document.createElement('div');
        alertDiv.id = 'trafficAlert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.bottom = '10px';
        alertDiv.style.left = '10px';
        alertDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        alertDiv.style.color = 'white';
        alertDiv.style.padding = '10px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.zIndex = '1000';
        document.body.appendChild(alertDiv);
    }
    alertDiv.textContent = message;
}

// Function to close the traffic alert
function closeAlert() {
    const alertDiv = document.getElementById('trafficAlert');
    if (alertDiv) {
        alertDiv.textContent = ''; // Clear the message
    }
}

// Start the route update process
function startRoute(route, trafficHighlight) {
    updateRouteStepByStep(route, trafficHighlight);
}

// Example usage: Update sidebar and start route for Route 1
updateSidebarLocations(route1);
startRoute(route1, true); // Pass 'true' to highlight traffic areas
