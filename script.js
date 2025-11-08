/**
 * Maze Path Finder - Discrete Mathematics Project
 * Implements Depth-First Search (DFS) algorithm for pathfinding
 * 
 * Graph Theory Concepts:
 * - Each cell represents a vertex in the graph
 * - Adjacent cells represent edges between vertices
 * - DFS explores the graph by recursively visiting connected vertices
 * - The maze is represented as a 2D adjacency structure
 */

class MazePathFinder {
    constructor() {
        // Determine grid size based on screen size
        this.gridSize = this.getResponsiveGridSize();
        this.maze = [];
        this.visited = [];
        this.path = [];
        this.startPos = null;
        this.endPos = null;
        this.currentMode = 'wall'; // 'start', 'end', 'wall'
        this.isSearching = false;
        
        this.initializeMaze();
        this.createMazeDOM();
        this.bindEvents();
        this.updateStatus("Click 'Set Start' and choose a cell to begin");
    }
    
    /**
     * Determines appropriate grid size based on screen width
     * Ensures good user experience across devices
     */
    getResponsiveGridSize() {
        const width = window.innerWidth;
        if (width < 480) return 10;
        if (width < 768) return 12;
        return 15;
    }
    
    /**
     * Initializes the maze data structure
     * 0 = open path, 1 = wall
     */
    initializeMaze() {
        this.maze = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(0)
        );
        this.visited = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(false)
        );
        this.path = [];
    }
    
    /**
     * Creates the visual grid in the DOM
     * Uses CSS Grid for responsive layout
     */
    createMazeDOM() {
        const mazeElement = document.getElementById('maze');
        mazeElement.innerHTML = '';
        
        // Update CSS grid template
        mazeElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        mazeElement.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
        
        // Create cells
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                cell.addEventListener('mouseover', () => this.handleCellHover(row, col));
                
                mazeElement.appendChild(cell);
            }
        }
    }
    
    /**
     * Binds event listeners to control buttons
     */
    bindEvents() {
        document.getElementById('setStartBtn').addEventListener('click', () => this.setMode('start'));
        document.getElementById('setEndBtn').addEventListener('click', () => this.setMode('end'));
        document.getElementById('addWallsBtn').addEventListener('click', () => this.setMode('wall'));
        document.getElementById('solveBtn').addEventListener('click', () => this.solveMaze());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearMaze());
        
        // Handle window resize for responsive grid
        window.addEventListener('resize', () => {
            const newSize = this.getResponsiveGridSize();
            if (newSize !== this.gridSize) {
                this.gridSize = newSize;
                this.clearMaze();
                this.createMazeDOM();
            }
        });
    }
    
    /**
     * Sets the current interaction mode
     */
    setMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${mode === 'wall' ? 'addWalls' : 'set' + mode.charAt(0).toUpperCase() + mode.slice(1)}Btn`)
            .classList.add('active');
        
        // Update status message
        const messages = {
            start: "Click a cell to set the start point (green)",
            end: "Click a cell to set the end point (red)",
            wall: "Click cells to add/remove walls (black)"
        };
        this.updateStatus(messages[mode]);
    }
    
    /**
     * Handles cell click events based on current mode
     */
    handleCellClick(row, col) {
        if (this.isSearching) return;
        
        const cell = this.getCellElement(row, col);
        
        switch (this.currentMode) {
            case 'start':
                this.setStartPoint(row, col, cell);
                break;
            case 'end':
                this.setEndPoint(row, col, cell);
                break;
            case 'wall':
                this.toggleWall(row, col, cell);
                break;
        }
        
        this.updateSolveButton();
    }
    
    /**
     * Handles cell hover for visual feedback
     */
    handleCellHover(row, col) {
        if (this.isSearching) return;
        
        const cell = this.getCellElement(row, col);
        const isOccupied = cell.classList.contains('start') || 
                          cell.classList.contains('end') || 
                          cell.classList.contains('wall');
        
        if (!isOccupied && this.currentMode !== 'wall') {
            cell.style.backgroundColor = this.currentMode === 'start' ? '#68d391' : '#fc8181';
        }
        
        cell.addEventListener('mouseleave', () => {
            if (!isOccupied) {
                cell.style.backgroundColor = '';
            }
        });
    }
    
    /**
     * Sets the start point for pathfinding
     */
    setStartPoint(row, col, cell) {
        // Remove previous start
        const prevStart = document.querySelector('.cell.start');
        if (prevStart) {
            prevStart.classList.remove('start');
            const prevRow = parseInt(prevStart.dataset.row);
            const prevCol = parseInt(prevStart.dataset.col);
            this.maze[prevRow][prevCol] = 0;
        }
        
        // Set new start
        cell.classList.remove('wall', 'end');
        cell.classList.add('start');
        this.startPos = { row, col };
        this.maze[row][col] = 0; // Ensure start is not a wall
        
        this.updateStatus("Start point set! Now click 'Set End' and choose the destination.");
        this.setMode('end');
    }
    
    /**
     * Sets the end point for pathfinding
     */
    setEndPoint(row, col, cell) {
        // Remove previous end
        const prevEnd = document.querySelector('.cell.end');
        if (prevEnd) {
            prevEnd.classList.remove('end');
            const prevRow = parseInt(prevEnd.dataset.row);
            const prevCol = parseInt(prevEnd.dataset.col);
            this.maze[prevRow][prevCol] = 0;
        }
        
        // Set new end
        cell.classList.remove('wall', 'start');
        cell.classList.add('end');
        this.endPos = { row, col };
        this.maze[row][col] = 0; // Ensure end is not a wall
        
        this.updateStatus("End point set! Now you can add walls or click 'Solve Maze'.");
        this.setMode('wall');
    }
    
    /**
     * Toggles wall state for a cell
     */
    toggleWall(row, col, cell) {
        // Can't place walls on start/end
        if (cell.classList.contains('start') || cell.classList.contains('end')) {
            return;
        }
        
        if (cell.classList.contains('wall')) {
            cell.classList.remove('wall');
            this.maze[row][col] = 0;
        } else {
            cell.classList.add('wall');
            this.maze[row][col] = 1;
        }
    }
    
    /**
     * Main solver function - initiates DFS pathfinding
     */
    async solveMaze() {
        if (!this.startPos || !this.endPos) {
            this.updateStatus("Please set both start and end points first!");
            return;
        }
        
        if (this.isSearching) return;
        
        this.isSearching = true;
        document.getElementById('solveBtn').disabled = true;
        this.clearSearchResults();
        this.updateStatus("Searching for path using DFS algorithm...");
        
        // Reset visited array
        this.visited = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(false)
        );
        this.path = [];
        
        // Start DFS from the start position
        const pathFound = await this.dfs(this.startPos.row, this.startPos.col);
        
        if (pathFound) {
            await this.animatePath();
            this.updateStatus(`Path found! Length: ${this.path.length} steps. DFS explored ${this.countVisited()} cells.`);
        } else {
            this.updateStatus("No path exists between start and end points!");
        }
        
        this.isSearching = false;
        document.getElementById('solveBtn').disabled = false;
    }
    
    /**
     * Depth-First Search algorithm implementation
     * Recursively explores the graph to find a path
     * 
     * @param {number} row - Current row position
     * @param {number} col - Current column position
     * @returns {boolean} - True if path to end is found
     */
    async dfs(row, col) {
        // Base case: reached the end
        if (row === this.endPos.row && col === this.endPos.col) {
            this.path.push({ row, col });
            return true;
        }
        
        // Base case: out of bounds
        if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
            return false;
        }
        
        // Base case: wall or already visited
        if (this.maze[row][col] === 1 || this.visited[row][col]) {
            return false;
        }
        
        // Mark as visited
        this.visited[row][col] = true;
        
        // Visual feedback for visited cells (except start/end)
        if (!(row === this.startPos.row && col === this.startPos.col) &&
            !(row === this.endPos.row && col === this.endPos.col)) {
            const cell = this.getCellElement(row, col);
            cell.classList.add('visited');
            
            // Small delay for visualization
            await this.sleep(50);
        }
        
        // Explore all four directions (up, down, left, right)
        // This represents exploring adjacent vertices in the graph
        const directions = [
            [-1, 0], // up
            [1, 0],  // down
            [0, -1], // left
            [0, 1]   // right
        ];
        
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            
            if (await this.dfs(newRow, newCol)) {
                // If path found through this direction, add current cell to path
                this.path.push({ row, col });
                return true;
            }
        }
        
        // No path found through this cell
        return false;
    }
    
    /**
     * Animates the final path with visual effects
     */
    async animatePath() {
        // Reverse path to show from start to end
        this.path.reverse();
        
        for (const { row, col } of this.path) {
            const cell = this.getCellElement(row, col);
            cell.classList.add('path');
            await this.sleep(100);
        }
    }
    
    /**
     * Utility function for creating delays in async functions
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Counts the number of visited cells for statistics
     */
    countVisited() {
        let count = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.visited[row][col]) count++;
            }
        }
        return count;
    }
    
    /**
     * Clears search results (visited and path) but keeps walls/start/end
     */
    clearSearchResults() {
        document.querySelectorAll('.cell.visited, .cell.path').forEach(cell => {
            cell.classList.remove('visited', 'path');
        });
    }
    
    /**
     * Completely clears the maze
     */
    clearMaze() {
        this.initializeMaze();
        this.startPos = null;
        this.endPos = null;
        this.isSearching = false;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.className = 'cell';
        });
        
        document.getElementById('solveBtn').disabled = false;
        this.setMode('wall');
        this.updateStatus("Maze cleared! Click 'Set Start' to begin.");
    }
    
    /**
     * Updates the solve button state based on start/end positions
     */
    updateSolveButton() {
        const solveBtn = document.getElementById('solveBtn');
        solveBtn.disabled = !this.startPos || !this.endPos || this.isSearching;
    }
    
    /**
     * Updates the status message
     */
    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }
    
    /**
     * Gets the DOM element for a specific cell
     */
    getCellElement(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
}

// Initialize the maze when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MazePathFinder();
});