import React, { useState, useEffect, useRef } from 'react';
import './TreeVisualizer.css';
import { bstInsertSteps, bstSearchSteps, bstDeleteSteps, RedBlackTree } from '../algorithms/treeAlgorithms';

const NODE_RADIUS = 22;
const V_SPACING = 80;
const PADDING = 48;

const ALGO_INFO = {
  bst: {
    title: 'Binary Search Tree',
    complexity: 'Search / Insert / Delete: O(h) — h is tree height',
    description: 'Left child < parent < right child. Operations traverse the tree by comparing values.',
  },
  rbt: {
    title: 'Red-Black Tree',
    complexity: 'Search / Insert: O(log n) guaranteed',
    description: 'Self-balancing BST. Red/black coloring rules ensure O(log n) height via rotations on insert.',
  },
};

const SPEED_DELAYS = { 1: 3000, 2: 2000, 3: 1000 };

function TreeVisualizer({ treeType, operation, onOperationComplete, speed }) {
  const treeRef = useRef(null);
  const [snapshot, setSnapshot] = useState({ nodes: [], edges: [], message: '' });
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSteps, setHasSteps] = useState(false);
  const isPlayingRef = useRef(false);

  // Reset tree when type changes
  useEffect(() => {
    if (treeType === 'bst') {
      treeRef.current = null;
    } else {
      treeRef.current = new RedBlackTree();
    }
    setSnapshot({ nodes: [], edges: [], message: '' });
    setSteps([]);
    setStepIndex(0);
    setIsPlaying(false);
    setHasSteps(false);
  }, [treeType]);

  // Collect steps when a new operation fires
  useEffect(() => {
    if (!operation) return;

    const { op, value } = operation;
    let result;

    try {
      if (treeType === 'bst') {
        if (op === 'insert') {
          result = bstInsertSteps(treeRef.current, value);
          treeRef.current = result.newRoot;
        } else if (op === 'search') {
          result = bstSearchSteps(treeRef.current, value);
        } else if (op === 'delete') {
          result = bstDeleteSteps(treeRef.current, value);
          treeRef.current = result.newRoot;
        }
      } else {
        if (op === 'insert') {
          result = treeRef.current.insertSteps(value);
        } else if (op === 'search') {
          result = treeRef.current.searchSteps(value);
        }
      }
    } catch (err) {
      console.error('Tree operation error:', err);
    }

    if (result && result.steps.length > 0) {
      setSteps(result.steps);
      setStepIndex(0);
      setSnapshot(result.steps[0]);
      setHasSteps(true);
      setIsPlaying(true);
    } else {
      onOperationComplete();
    }
  }, [operation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep ref in sync for the timeout callback
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Auto-play: advance one step at a time
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const delay = SPEED_DELAYS[speed] ?? 600;
    const timer = setTimeout(() => {
      if (!isPlayingRef.current) return;
      setStepIndex((i) => {
        const next = i + 1;
        if (next < steps.length) {
          setSnapshot(steps[next]);
          return next;
        } else {
          setIsPlaying(false);
          onOperationComplete();
          return i;
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps, speed]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setIsPlaying(false);
      const next = stepIndex + 1;
      setStepIndex(next);
      setSnapshot(steps[next]);
      if (next === steps.length - 1) {
        onOperationComplete();
      }
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setIsPlaying(false);
      const prev = stepIndex - 1;
      setStepIndex(prev);
      setSnapshot(steps[prev]);
    }
  };

  const handlePlayPause = () => {
    if (stepIndex >= steps.length - 1) {
      // Replay from start
      setStepIndex(0);
      setSnapshot(steps[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const clearTree = () => {
    if (isPlaying) return;
    if (treeType === 'bst') {
      treeRef.current = null;
    } else {
      treeRef.current = new RedBlackTree();
    }
    setSnapshot({ nodes: [], edges: [], message: '' });
    setSteps([]);
    setStepIndex(0);
    setIsPlaying(false);
    setHasSteps(false);
  };

  // ---- Layout ----
  const { nodes, edges, message } = snapshot;
  const nodeCount = nodes.length;
  const hSpacing = nodeCount > 0 ? Math.max(48, Math.min(80, 900 / nodeCount)) : 60;

  const nodeMap = {};
  nodes.forEach((n) => {
    nodeMap[n.id] = {
      ...n,
      x: PADDING + n.layoutX * hSpacing + hSpacing / 2,
      y: PADDING + n.layoutY * V_SPACING + NODE_RADIUS,
    };
  });

  const svgWidth = Math.max(600, nodeCount * hSpacing + PADDING * 2);
  const maxDepth = nodeCount > 0 ? Math.max(...nodes.map((n) => n.layoutY)) : 0;
  const svgHeight = Math.max(200, (maxDepth + 1) * V_SPACING + PADDING * 2 + NODE_RADIUS);

  const RED = 'red';

  const getNodeFill = (node) => {
    if (node.state === 'comparing') return '#ff9800';
    if (node.state === 'found') return '#4caf50';
    if (node.state === 'inserted') return '#66bb6a';
    if (treeType === 'rbt') {
      if (node.state === 'path') return node.color === RED ? '#ef9a9a' : '#78909c';
      return node.color === RED ? '#f44336' : '#37474f';
    }
    if (node.state === 'path') return '#FFC627';
    return '#8C1D40';
  };

  const getStroke = (node) => {
    if (node.state === 'comparing') return '#e65100';
    if (node.state === 'found') return '#2e7d32';
    if (node.state === 'inserted') return '#1b5e20';
    return 'rgba(0,0,0,0.2)';
  };

  const info = ALGO_INFO[treeType];
  const atEnd = stepIndex >= steps.length - 1;

  return (
    <div className="tree-visualizer">
      <div className="tree-info-bar">
        <div className="tree-info-complexity">{info.complexity}</div>
        <div className="tree-info-desc">{info.description}</div>
      </div>

      <div className="tree-container">
        {nodeCount === 0 ? (
          <div className="tree-empty">
            <p>Tree is empty. Insert values using the controls.</p>
          </div>
        ) : (
          <div className="svg-scroll-wrapper">
            <svg width={svgWidth} height={svgHeight} aria-label={`${info.title} visualization`}>
              {edges.map((e, i) => {
                const from = nodeMap[e.from];
                const to = nodeMap[e.to];
                if (!from || !to) return null;
                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2"
                  />
                );
              })}
              {Object.values(nodeMap).map((node) => (
                <g key={node.id} className="tree-node-group">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS}
                    fill={getNodeFill(node)}
                    stroke={getStroke(node)}
                    strokeWidth={node.state !== 'normal' && node.state !== 'path' ? 2.5 : 1}
                  />
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="inherit"
                  >
                    {node.value}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}

        {message && <div className="tree-message">{message}</div>}
      </div>

      {/* Step navigation */}
      {hasSteps && (
        <div className="step-nav">
          <button
            className="step-btn"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            title="Previous step"
          >
            &#8592;
          </button>

          <button
            className="step-btn step-btn-play"
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : atEnd ? 'Replay' : 'Play'}
          >
            {isPlaying ? '⏸' : atEnd ? '↺' : '▶'}
          </button>

          <button
            className="step-btn"
            onClick={handleNext}
            disabled={atEnd}
            title="Next step"
          >
            &#8594;
          </button>

          <span className="step-counter">
            {stepIndex + 1} / {steps.length}
          </span>
        </div>
      )}

      {treeType === 'rbt' && nodeCount > 0 && (
        <div className="rbt-legend">
          <span className="legend-item">
            <span className="legend-dot rbt-red" />
            Red node
          </span>
          <span className="legend-item">
            <span className="legend-dot rbt-black" />
            Black node
          </span>
        </div>
      )}

      <div className="tree-actions">
        <button className="btn-clear-tree" onClick={clearTree} disabled={isPlaying}>
          Clear Tree
        </button>
      </div>
    </div>
  );
}

export default TreeVisualizer;
