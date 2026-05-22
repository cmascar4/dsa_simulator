import React, { useState, useEffect, useRef } from 'react';
import './Visualizer.css';
import { sortingAlgorithms } from '../algorithms/sortingAlgorithms';

const SPEED_DELAYS = { 1: 1600, 2: 600, 3: 160 };

function Visualizer({ arraySize, selectedAlgorithm, isRunning, setIsRunning, speed, order }) {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, iterations: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [alreadySorted, setAlreadySorted] = useState(false);

  const arrayRef = useRef([]);
  const isPausedRef = useRef(false);
  const isSortingRef = useRef(false);
  const isCompleteRef = useRef(false);

  useEffect(() => {
    arrayRef.current = array;
  }, [array]);

  // Initialize array
  useEffect(() => {
    generateNewArray();
  }, [arraySize]); // eslint-disable-line react-hooks/exhaustive-deps

  // Allow re-sort when order changes after a completed sort
  useEffect(() => {
    if (isCompleteRef.current) {
      isCompleteRef.current = false;
      setIsComplete(false);
      setAlreadySorted(false);
      setSorted([]);
    }
  }, [order]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateNewArray = () => {
    isSortingRef.current = false;
    isPausedRef.current = false;
    isCompleteRef.current = false;
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setComparing([]);
    setSorted([]);
    setStats({ comparisons: 0, swaps: 0, iterations: 0 });
    setIsComplete(false);
    setAlreadySorted(false);
  };

  // Handle play / pause / resume
  useEffect(() => {
    if (isRunning) {
      if (isSortingRef.current) {
        // Resume
        isPausedRef.current = false;
      } else {
        // Start new sort — regenerate array if previous run already completed
        if (isCompleteRef.current) {
          setAlreadySorted(true);
          setTimeout(() => setAlreadySorted(false), 2500);
          setIsRunning(false);
          return;
        }
        isPausedRef.current = false;
        isSortingRef.current = true;

        const algorithm = sortingAlgorithms[selectedAlgorithm];
        if (!algorithm) return;

        const delay = SPEED_DELAYS[speed] ?? 300;
        const initialArray = [...arrayRef.current];

        algorithm(
          initialArray,
          (comparingIndices, sortedIndices, newStats, currentArray) => {
            if (currentArray) setArray([...currentArray]);
            setComparing(comparingIndices);
            setSorted(sortedIndices);
            setStats(newStats);
          },
          delay,
          isPausedRef,
          order
        ).then(() => {
          isSortingRef.current = false;
          isPausedRef.current = false;
          isCompleteRef.current = true;
          setComparing([]);
          setSorted(Array.from({ length: arrayRef.current.length }, (_, i) => i));
          setIsRunning(false);
          setIsComplete(true);
        });
      }
    } else {
      // Pause
      if (isSortingRef.current) {
        isPausedRef.current = true;
      }
    }
  }, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  const getBarColor = (index) => {
    if (sorted.includes(index)) return '#4caf50';
    if (comparing.includes(index)) return '#ff9800';
    return '#8C1D40';
  };

  const getBarHeight = (value) => (value / 100) * 100;

  return (
    <div className="visualizer">
      {alreadySorted && (
        <div className="completion-message already-sorted">
          Array is already sorted. Generate a new array to sort again.
        </div>
      )}

      <div className="visualizer-container">
        <div className="bars-container">
          {array.map((value, index) => (
            <div key={index} className="bar-wrapper">
              <span className="bar-label">{value}</span>
              <div
                className="bar"
                style={{
                  height: `${getBarHeight(value)}%`,
                  backgroundColor: getBarColor(index),
                }}
              />
            </div>
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

      {isComplete && !alreadySorted && (
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
