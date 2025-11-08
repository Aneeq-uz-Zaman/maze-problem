# 🧠 Maze Path Finder – A Discrete Mathematics Web Project

![Maze Path Finder Demo](https://img.shields.io/badge/Demo-Live-green) ![Status](https://img.shields.io/badge/Status-Complete-success) ![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)

## 🎯 Project Overview

An interactive web application that demonstrates **graph theory** and **recursion** concepts from Discrete Mathematics through visual maze pathfinding. Users can create custom mazes and watch the **Depth-First Search (DFS)** algorithm find paths in real-time.

## 🧮 Mathematical Concepts Demonstrated

- **Graph Theory**: Each cell represents a vertex; adjacent cells represent edges
- **DFS Algorithm**: Recursive exploration of connected vertices
- **Pathfinding**: Finding connected subgraphs between start and end points
- **Backtracking**: DFS naturally backtracks when dead ends are encountered

## ✨ Features

### 🎮 Interactive Maze Creation
- **10×10 to 15×15 responsive grid** (adapts to screen size)
- **Set Start Point** (green) - Click to place the starting vertex
- **Set End Point** (red) - Click to place the destination vertex
- **Add/Remove Walls** (black) - Click to create obstacles

### 🔍 Visual Algorithm Execution
- **Real-time DFS visualization** - Watch the algorithm explore the maze
- **Visited cells** (light blue) - Shows the search progression
- **Final path** (yellow) - Highlights the discovered route
- **Search statistics** - Displays path length and cells explored

### 📱 Responsive Design
- **Mobile-friendly** layout with touch support
- **Adaptive grid size** based on screen dimensions
- **Smooth animations** and visual feedback

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)

### Local Development

1. **Clone or download** the project files
2. **Navigate** to the project directory
3. **Start local server**:
   ```bash
   python -m http.server 3000
   ```
4. **Open browser** to `http://localhost:3000`

### VS Code Integration
- Use the **"Serve Maze Path Finder"** task in VS Code
- Opens automatically in the Simple Browser

## 🎯 How to Use

1. **Set Start Point**: Click "Set Start" button, then click a cell
2. **Set End Point**: Click "Set End" button, then click another cell
3. **Add Walls** (optional): Click "Add/Remove Walls", then click cells to create obstacles
4. **Solve Maze**: Click "Solve Maze" to run the DFS algorithm
5. **Clear and Repeat**: Click "Clear Maze" to start over

## 🧩 Algorithm Implementation

### Depth-First Search (DFS)
```javascript
async dfs(row, col) {
    // Base case: reached the end
    if (row === this.endPos.row && col === this.endPos.col) {
        this.path.push({ row, col });
        return true;
    }
    
    // Base cases: out of bounds, wall, or visited
    if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize ||
        this.maze[row][col] === 1 || this.visited[row][col]) {
        return false;
    }
    
    // Mark as visited
    this.visited[row][col] = true;
    
    // Explore all four directions
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dx, dy] of directions) {
        if (await this.dfs(row + dx, col + dy)) {
            this.path.push({ row, col });
            return true;
        }
    }
    
    return false;
}
```

### Key Features:
- **Recursive exploration** of adjacent cells
- **Backtracking** when dead ends are encountered
- **Path reconstruction** by tracking successful routes
- **Visual feedback** during algorithm execution

## 🎨 Technical Architecture

### File Structure
```
maze-path-finder/
├── index.html          # Main application structure
├── style.css           # Responsive styling with CSS Grid
├── script.js           # DFS algorithm and interactions
├── .github/
│   └── copilot-instructions.md
└── README.md
```

### Technology Stack
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Grid layout, flexbox, animations, and responsive design
- **Vanilla JavaScript**: ES6+ features, async/await, DOM manipulation
- **CSS Grid**: For creating the maze layout
- **CSS Animations**: Visual feedback for algorithm execution

### Responsive Breakpoints
- **Desktop** (≥768px): 15×15 grid, full feature set
- **Tablet** (≥480px): 12×12 grid, optimized controls
- **Mobile** (<480px): 10×10 grid, stacked layout

## 🌐 Deployment

### Vercel Deployment
This project is ready for **one-click deployment** on Vercel:

1. Push to GitHub repository
2. Connect to Vercel
3. Deploy automatically (static files)

### Alternative Platforms
- **Netlify**: Drag and drop the project folder
- **GitHub Pages**: Enable Pages in repository settings
- **Firebase Hosting**: Use Firebase CLI

## 🎓 Educational Value

### Discrete Mathematics Concepts
- **Graph Representation**: 2D array as adjacency structure
- **Vertex and Edge Relationships**: Cell connections
- **Path Finding**: Connected subgraph discovery
- **Algorithm Complexity**: Time and space analysis

### Computer Science Principles
- **Recursion**: DFS implementation
- **Backtracking**: Systematic exploration
- **Data Structures**: 2D arrays, stacks (call stack)
- **Algorithm Visualization**: Step-by-step execution

## 🔧 Customization Options

### Grid Size
Modify the `getResponsiveGridSize()` function to change grid dimensions:
```javascript
getResponsiveGridSize() {
    const width = window.innerWidth;
    if (width < 480) return 8;   // Smaller mobile grid
    if (width < 768) return 12;  // Medium tablet grid
    return 20;                   // Large desktop grid
}
```

### Animation Speed
Adjust the delay in the DFS function:
```javascript
await this.sleep(50); // Milliseconds between steps
```

### Color Scheme
Modify CSS variables in `style.css`:
```css
:root {
    --start-color: #48bb78;
    --end-color: #f56565;
    --wall-color: #2d3748;
    --visited-color: #bee3f8;
    --path-color: #fbb829;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Discrete Mathematics** course concepts
- **Graph theory** principles
- **Algorithm visualization** techniques
- **Responsive web design** best practices

---

**Built with ❤️ for educational purposes** | **Demonstrates graph theory and recursive algorithms**