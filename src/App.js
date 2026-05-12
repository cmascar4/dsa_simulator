import React, { useState } from 'react';
import './App.css';
import Visualizer from './components/Visualizer';
import TreeVisualizer from './components/TreeVisualizer';
import Controls from './components/Controls';

const TREE_ALGORITHMS = ['bst', 'rbt'];

function App() {
  const [arraySize, setArraySize] = useState(20);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [treeOperation, setTreeOperation] = useState(null);

  const isTreeMode = TREE_ALGORITHMS.includes(selectedAlgorithm);

  const handleAlgorithmChange = (algo) => {
    if (isRunning) return;
    setSelectedAlgorithm(algo);
    setTreeOperation(null);
    setIsRunning(false);
  };

  const handleTreeOperation = (op, value) => {
    if (isRunning) return;
    setIsRunning(true);
    setTreeOperation({ op, value });
  };

  const handleOperationComplete = () => {
    setTreeOperation(null);
    setIsRunning(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>DSA Simulator</h1>
        <p>Interactive Data Structures & Algorithms Visualizer</p>
      </header>

      <main className="app-main">
        <Controls
          arraySize={arraySize}
          setArraySize={setArraySize}
          selectedAlgorithm={selectedAlgorithm}
          setSelectedAlgorithm={handleAlgorithmChange}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          speed={speed}
          setSpeed={setSpeed}
          onTreeOperation={handleTreeOperation}
        />

        {isTreeMode ? (
          <TreeVisualizer
            treeType={selectedAlgorithm}
            operation={treeOperation}
            onOperationComplete={handleOperationComplete}
            speed={speed}
          />
        ) : (
          <Visualizer
            arraySize={arraySize}
            selectedAlgorithm={selectedAlgorithm}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            speed={speed}
          />
        )}
      </main>
    </div>
  );
}

export default App;
