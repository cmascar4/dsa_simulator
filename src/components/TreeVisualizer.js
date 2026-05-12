import React, { useState, useEffect, useRef } from 'react';
import './TreeVisualizer.css';
import { bstInsert, bstSearch, bstDelete, RedBlackTree } from '../algorithms/treeAlgorithms';

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

function TreeVisualizer({ treeType, operation, onOperationComplete, speed }) {
  const treeRef = useRef(null);
  const [snapshot, setSnapshot] = useState({ nodes: [], edges: [], message: '' });
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset tree when type changes
  useEffect(() => {
    if (treeType === 'bst') {
      treeRef.current = null;
    } else {
      treeRef.current = new RedBlackTree();
    }
    setSnapshot({ nodes: [], edges: [], message: '' });
  }, [treeType]);

  // Run tree operation
  useEffect(() => {
    if (!operation) return;

    const run = async () => {
      setIsAnimating(true);
      const { op, value } = operation;

      try {
        if (treeType === 'bst') {
          if (op === 'insert') {
            treeRef.current = await bstInsert(treeRef.current, value, setSnapshot, speed);
          } else if (op === 'search') {
            await bstSearch(treeRef.current, value, setSnapshot, speed);
          } else if (op === 'delete') {
            treeRef.current = await bstDelete(treeRef.current, value, setSnapshot, speed);
          }
        } else {
          if (op === 'insert') {
            await treeRef.current.insert(value, setSnapshot, speed);
          } else if (op === 'search') {
            await treeRef.current.search(value, setSnapshot, speed);
          }
        }
      } catch (err) {
        console.error('Tree operation error:', err);
      }

      setIsAnimating(false);
      onOperationComplete();
    };

    run();
  }, [operation]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearTree = () => {
    if (isAnimating) return;
    if (treeType === 'bst') {
      treeRef.current = null;
    } else {
      treeRef.current = new RedBlackTree();
    }
    setSnapshot({ nodes: [], edges: [], message: '' });
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

  const getNodeFill = (node) => {
    if (node.state === 'comparing') return '#ff9800';
    if (node.state === 'found') return '#4caf50';
    if (node.state === 'inserted') return '#66bb6a';
    if (treeType === 'rbt') {
      if (node.state === 'path') return node.color === RED ? '#ef9a9a' : '#78909c';
      return node.color === RED ? '#f44336' : '#37474f';
    }
    if (node.state === 'path') return '#8fa8f5';
    return '#667eea';
  };

  const getStroke = (node) => {
    if (node.state === 'comparing') return '#e65100';
    if (node.state === 'found') return '#2e7d32';
    if (node.state === 'inserted') return '#1b5e20';
    return 'rgba(0,0,0,0.2)';
  };

  const RED = 'red';
  const info = ALGO_INFO[treeType];

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
              {/* Edges */}
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
                    stroke="#bbb"
                    strokeWidth="2"
                  />
                );
              })}
              {/* Nodes */}
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
                    fontSize={node.value > 99 ? '11' : '13'}
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

      {/* Legend for RBT */}
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
        <button className="btn-clear-tree" onClick={clearTree} disabled={isAnimating}>
          Clear Tree
        </button>
      </div>
    </div>
  );
}

export default TreeVisualizer;
