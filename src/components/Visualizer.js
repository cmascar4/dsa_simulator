import React, { useState, useEffect } from 'react';
import './Visualizer.css';
import { sortingAlgorithms } from '../algorithms/sortingAlgorithms';

function Visualizer({ arraySize, selectedAlgorithm, isRunning, setIsRunning, speed }) {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, iterations: 0 });
  const [isComplete, setIsComplete] = useState(false);

  // Initialize array
  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  const generateNewArray = () => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setComparing([]);
    setSorted([]);
    setStats({ comparisons: 0, swaps: 0, iterations: 0 });
    setIsComplete(false);
  };

  // Run sorting algorithm
  useEffect(() => {
    if (!isRunning || array.length === 0) return;

    const runSort = async () => {
      const algorithm = sortingAlgorithms[selectedAlgorithm];
      if (!algorithm) return;

      await algorithm(
        [...array],
        (comparing, sorted, stats) => {
          setComparing(comparing);
          setSorted(sorted);
          setStats(stats);
        },
        speed
      );

      setComparing([]);
      setSorted(Array.from({ length: array.length }, (_, i) => i));
      setIsRunning(false);
      setIsComplete(true);
    };

    runSort();
  }, [isRunning, array, selectedAlgorithm, speed]);

  const getBarColor = (index) => {
    if (sorted.includes(index)) return '#4caf50';
    if (comparing.includes(index)) return '#ff9800';
    return '#8C1D40';
  };

  const getBarHeight = (value) => {
    return (value / 100) * 100;
  };

  return (
    <div className="visualizer">
      <div className="visualizer-container">
        <div className="bars-container">
          {array.map((value, index) => (
            <div
              key={index}
              className="bar"
              style={{
                height: `${getBarHeight(value)}%`,
                backgroundColor: getBarColor(index),
                transition: 'all 0.05s ease',
              }}
            />
          ))}
        </div>
      </div>

      <div className="stats-panel">
        <div className="stat">
          <span className="stat-label">Comparisons:</span>
          <span className="stat-value">{stats.comparisons}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Swaps:</span>
          <span className="stat-value">{stats.swaps}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Iterations:</span>
          <span className="stat-value">{stats.iterations}</span>
        </div>
      </div>

      {isComplete && (
        <div className="completion-message">
          ✓ Sorting Complete!
        </div>
      )}

      <button
        className="btn-regenerate"
        onClick={generateNewArray}
        disabled={isRunning}
      >
        Generate New Array
      </button>
    </div>
  );
}

export default Visualizer;
