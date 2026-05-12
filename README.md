# DSA Simulator

An interactive, educational web application that visualizes different sorting algorithms in action. Perfect for students learning Data Structures and Algorithms (DSA).

## Overview

The DSA Simulator allows students to explore how different sorting algorithms work through animated visualizations. Simply input the array size, select a sorting algorithm, and watch as the visualizer demonstrates each step of the sorting process.

### Key Features

- **5 Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort
- **Real-time Visualization**: Watch each algorithm in action with smooth animations
- **Speed Control**: Adjust visualization speed from 10% to 500%
- **Pause/Resume**: Pause the animation to analyze specific steps
- **Performance Metrics**: Track comparisons, swaps, and iterations
- **Customizable Array Size**: Test with arrays from 5 to 150 elements
- **Responsive Design**: Works on desktop and tablet devices
- **No Coding Required**: Pure visual learning experience

## Supported Algorithms

### 1. **Bubble Sort**
- **Time Complexity**: O(n²)
- **Best for**: Understanding basic sorting concepts
- **Characteristics**: Repeatedly compares adjacent elements and swaps them if in wrong order

### 2. **Selection Sort**
- **Time Complexity**: O(n²)
- **Best for**: Understanding selection-based sorting
- **Characteristics**: Finds minimum element and places it at beginning each iteration

### 3. **Insertion Sort**
- **Time Complexity**: O(n²)
- **Best for**: Nearly sorted data
- **Characteristics**: Inserts each element into its correct position in sorted portion

### 4. **Merge Sort**
- **Time Complexity**: O(n log n)
- **Best for**: Divide-and-conquer approach
- **Characteristics**: Divides array and merges sorted subarrays

### 5. **Quick Sort**
- **Time Complexity**: O(n log n) average
- **Best for**: General-purpose sorting
- **Characteristics**: Uses pivot partitioning for efficient sorting

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/cmascar4/DSA_Simulator.git
   cd DSA_Simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm build
   ```

## Usage Guide

1. **Select Algorithm**: Choose from the dropdown menu (Bubble Sort, Selection Sort, etc.)
2. **Set Array Size**: Use the slider to select how many numbers to sort (5-150)
3. **Adjust Speed**: Control animation speed using the speed slider (10%-500%)
4. **Start Sorting**: Click "Start Sorting" to begin the visualization
5. **Monitor Metrics**: Watch real-time statistics:
   - **Comparisons**: Number of element comparisons made
   - **Swaps**: Number of element exchanges
   - **Iterations**: Number of algorithm iterations

## Project Structure

```
DSA_Simulator/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/
│   │   ├── Controls.js     # Control panel component
│   │   ├── Controls.css    # Control styling
│   │   ├── Visualizer.js   # Visualization component
│   │   └── Visualizer.css  # Visualization styling
│   ├── algorithms/
│   │   └── sortingAlgorithms.js  # Sorting algorithm implementations
│   ├── App.js              # Main App component
│   ├── App.css             # App styling
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json            # Project dependencies
└── README.md              # This file
```

## Technologies Used

- **React 18**: UI framework
- **JavaScript ES6+**: Programming language
- **CSS3**: Styling with animations
- **HTML5**: Markup

## Learning Outcomes

By using this simulator, students will:

- ✓ Understand how different sorting algorithms work step-by-step
- ✓ Compare algorithm efficiency through performance metrics
- ✓ Visualize the differences between O(n²) and O(n log n) algorithms
- ✓ See how pivot selection affects Quick Sort performance
- ✓ Analyze the merge process in Merge Sort
- ✓ Understand time complexity through real-world demonstration

## Educational Benefits

### For Teachers
- Classroom presentation tool for algorithm demonstrations
- Visual aid for explaining algorithm concepts
- Interactive learning experience that increases engagement

### For Students
- Interactive learning without writing code
- Immediate visual feedback on algorithm behavior
- Ability to experiment with different array sizes
- Performance metrics to understand efficiency

## Tips for Learning

1. **Start Simple**: Begin with Bubble Sort to understand basic concepts
2. **Compare**: Run the same array with different algorithms to see efficiency differences
3. **Vary Array Sizes**: Test with small and large arrays to see scaling effects
4. **Slow Down**: Use lower speeds to carefully observe each step
5. **Repeat**: Run the same algorithm multiple times to reinforce understanding

## Performance Considerations

- **Small Arrays (5-50)**: All algorithms perform noticeably fast
- **Medium Arrays (50-100)**: Quadratic algorithms show visible slowdown
- **Large Arrays (100-150)**: Merge Sort and Quick Sort demonstrate clear advantages

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Roadmap

Future enhancements:
- [ ] Counting Sort and Radix Sort
- [ ] Heap Sort implementation
- [ ] Algorithm comparison mode
- [ ] Sound effects for comparisons/swaps
- [ ] Dark mode theme
- [ ] Code snippet display for each algorithm
- [ ] Detailed algorithm explanation panels
- [ ] Save/replay sorting visualizations

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainers.

---

**Happy Learning! 🚀**
