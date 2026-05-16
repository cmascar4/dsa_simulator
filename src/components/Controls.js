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
  order,
  setOrder,
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
    if (isNaN(val) || val < 1 || val > 99) return;
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

  const parsedVal = parseInt(treeValue, 10);
  const isValueValid = treeValue !== '' && !isNaN(parsedVal) && parsedVal >= 1 && parsedVal <= 99;

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
              <label htmlFor="tree-value">Value (1–99):</label>
              <input
                id="tree-value"
                type="number"
                className="tree-input"
                value={treeValue}
                onChange={(e) => setTreeValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRunning}
                min="1"
                max="99"
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
              <label>Speed:</label>
              <div className="speed-buttons">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-speed ${speed === s ? 'active' : ''}`}
                    onClick={() => setSpeed(s)}
                    disabled={isRunning}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="info-section">
              <h3>How to use</h3>
              <ul>
                <li>Type a value (1–99) and press <strong>Insert</strong></li>
                <li>Use <strong>Search</strong> to trace a value through the tree</li>
                {selectedAlgorithm === 'bst' && <li>Use <strong>Delete</strong> to remove a node</li>}
                <li>Each step is explained in the message bar</li>
                <li>Use ← → arrows to step through manually</li>
                <li>Hit ▶ to replay, ⏸ to pause mid-animation</li>
                <li>Select a speed — 1 slow, 2 medium, 3 fast</li>
                <li>Hit <strong>Clear Tree</strong> to start fresh</li>
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
                min="2"
                max="8"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                disabled={isRunning}
                className="slider"
              />
            </div>

            <div className="control-group">
              <label>Speed:</label>
              <div className="speed-buttons">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-speed ${speed === s ? 'active' : ''}`}
                    onClick={() => setSpeed(s)}
                    disabled={isRunning}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <label>Order:</label>
              <div className="speed-buttons">
                <button
                  className={`btn btn-speed ${order === 'asc' ? 'active' : ''}`}
                  onClick={() => setOrder('asc')}
                  disabled={isRunning}
                >
                  ↑ Asc
                </button>
                <button
                  className={`btn btn-speed ${order === 'desc' ? 'active' : ''}`}
                  onClick={() => setOrder('desc')}
                  disabled={isRunning}
                >
                  ↓ Desc
                </button>
              </div>
            </div>

            <div className="button-group">
              <button
                className={`btn btn-primary ${isRunning ? 'running' : ''}`}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'Pause' : 'Start / Resume'}
              </button>
            </div>

            <div className="info-section">
              <h3>How to use</h3>
              <ul>
                <li>Pick an algorithm from the dropdown</li>
                <li>Drag the slider to set array size (2–8)</li>
                <li>Choose ↑ Asc or ↓ Desc order</li>
                <li>Select a speed — 1 slow, 2 medium, 3 fast</li>
                <li>Hit <strong>Start / Resume</strong> to run</li>
                <li>Hit <strong>Pause</strong> to freeze mid-sort</li>
                <li>Orange bars are being compared, green are sorted</li>
                <li>Click <strong>Generate New Array</strong> to reset</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default Controls;
