import React, { useState, useEffect } from 'react';
import './Controls.css';

const ALGORITHMS = [
  { id: 'bubble', name: 'Bubble Sort', group: 'Sorting' },
  { id: 'selection', name: 'Selection Sort', group: 'Sorting' },
  { id: 'insertion', name: 'Insertion Sort', group: 'Sorting' },
  { id: 'merge', name: 'Merge Sort', group: 'Sorting' },
  { id: 'quick', name: 'Quick Sort', group: 'Sorting' },
  { id: 'bst', name: 'Binary Search Tree', group: 'Trees' },
  { id: 'rbt', name: 'Red-Black Tree', group: 'Trees' },
];

const TREE_IDS = ['bst', 'rbt'];

function Controls({
  arraySize,
  setArraySize,
  selectedAlgorithm,
  setSelectedAlgorithm,
  isRunning,
  setIsRunning,
  speed,
  setSpeed,
  onTreeOperation,
}) {
  const [treeValue, setTreeValue] = useState('');
  const isTreeMode = TREE_IDS.includes(selectedAlgorithm);

  // Clear input when switching algorithms
  useEffect(() => {
    setTreeValue('');
  }, [selectedAlgorithm]);

  const handleTreeOp = (op) => {
    const val = parseInt(treeValue, 10);
    if (isNaN(val) || val < 1 || val > 999) return;
    onTreeOperation(op, val);
    setTreeValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleTreeOp('insert');
  };

  const sortingGroups = [
    { label: 'Sorting Algorithms', ids: ['bubble', 'selection', 'insertion', 'merge', 'quick'] },
    { label: 'Tree Structures', ids: ['bst', 'rbt'] },
  ];

  const isValueValid = treeValue !== '' && !isNaN(parseInt(treeValue, 10));

  return (
    <aside className="controls">
      <div className="controls-card">
        <h2>Settings</h2>

        <div className="control-group">
          <label htmlFor="algorithm">Algorithm / Structure:</label>
          <select
            id="algorithm"
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isRunning}
          >
            {sortingGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {ALGORITHMS.filter((a) => group.ids.includes(a.id)).map((algo) => (
                  <option key={algo.id} value={algo.id}>
                    {algo.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {isTreeMode ? (
          <>
            <div className="control-group">
              <label htmlFor="tree-value">Value (1–999):</label>
              <input
                id="tree-value"
                type="number"
                className="tree-input"
                value={treeValue}
                onChange={(e) => setTreeValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRunning}
                min="1"
                max="999"
                placeholder="Enter a number"
              />
            </div>

            <div className="button-group tree-ops">
              <button
                className="btn btn-op btn-insert"
                onClick={() => handleTreeOp('insert')}
                disabled={isRunning || !isValueValid}
              >
                Insert
              </button>
              <button
                className="btn btn-op btn-search"
                onClick={() => handleTreeOp('search')}
                disabled={isRunning || !isValueValid}
              >
                Search
              </button>
              {selectedAlgorithm === 'bst' && (
                <button
                  className="btn btn-op btn-delete"
                  onClick={() => handleTreeOp('delete')}
                  disabled={isRunning || !isValueValid}
                >
                  Delete
                </button>
              )}
            </div>

            <div className="control-group">
              <label htmlFor="speed-tree">
                Speed: <span className="value">{speed}%</span>
              </label>
              <input
                id="speed-tree"
                type="range"
                min="10"
                max="500"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                step="10"
                className="slider"
              />
            </div>

            <div className="info-section">
              <h3>Instructions</h3>
              <ul>
                <li>Enter a number (1–999)</li>
                <li>Click Insert to add to the tree</li>
                <li>Click Search to find a value</li>
                {selectedAlgorithm === 'bst' && <li>Click Delete to remove a value</li>}
                <li>Watch each step explained live</li>
                <li>Use Clear Tree to start over</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="control-group">
              <label htmlFor="array-size">
                Array Size: <span className="value">{arraySize}</span>
              </label>
              <input
                id="array-size"
                type="range"
                min="5"
                max="150"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                disabled={isRunning}
                className="slider"
              />
            </div>

            <div className="control-group">
              <label htmlFor="speed">
                Speed: <span className="value">{speed}%</span>
              </label>
              <input
                id="speed"
                type="range"
                min="10"
                max="500"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                step="10"
                className="slider"
              />
            </div>

            <div className="button-group">
              <button
                className={`btn btn-primary ${isRunning ? 'running' : ''}`}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'Pause' : 'Start Sorting'}
              </button>
            </div>

            <div className="info-section">
              <h3>Instructions</h3>
              <ul>
                <li>Select a sorting algorithm</li>
                <li>Adjust the array size</li>
                <li>Set the visualization speed</li>
                <li>Click "Start Sorting" to begin</li>
                <li>Watch the algorithm in action!</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default Controls;
