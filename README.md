# 3D Blood Flow Simulator

A Three.js-based interactive 3D simulation of blood flow, visualizing the movement of red blood cells, white blood cells, and platelets through a blood vessel.

![Blood Flow Simulator Preview](https://github.com/user-attachments/assets/96add8ef-42c0-428b-a8c2-141e4a35fcc6)


## Features

- **Realistic Cell Models**: 
  - Red blood cells with biconcave disc shape
  - White blood cells with textured surface
  - Platelets with disc-like structure/granules
- **Interactive Controls**:
  - Adjust flow speed (0.5x to 5x)
  - Modify cell count (50 to 300 cells)
  - Toggle visibility of different cell types
  - Reset to default
- **3D Navigation**: Orbit controls
- **Responsive Design**: Mobile-friendly
- **Dynamic Animation**: Natural wobble/rotation

## Demo

Try the live demo here: [https://edisedis777.github.io/3D-Blood-Flow-Simulator/]

## Installation

1. Clone the repository:
```bash
git clone https://github.com/edisedis777/3d-blood-flow-simulator.git
```
2. Open the project directory:
```bash
cd 3d-blood-flow-simulator
```
3. Serve the files using a local web server (e.g., using Python):
```bash
python -m http.server 8000
```
4. Open your browser and navigate to http://localhost:8000

## Usage
- Desktop: Use mouse to rotate (left-click), pan (right-click), and zoom (scroll)
- Mobile: Touch and drag to rotate, pinch to zoom
- Adjust sliders and checkboxes in the control panel to modify the simulation
- Click "Reset" to return to default settings

## Project Structure
```text
3d-blood-flow-simulator/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript logic and implementation
└── README.md       # This file
```

## Technologies Used
- Three.js
- HTML5/CSS3
- JavaScript (ES6 Modules)

## Contributing
Contributions are welcome! 

## Credits
- Inspired by biological blood flow and created as an educational tool to demonstrate blood cell dynamics

## License
Distributed under the GNU Affero General Public License v3.0 License. See `LICENSE` for more information.
