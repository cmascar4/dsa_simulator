// ============================================================
// BST
// ============================================================

class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = `bst-${value}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }
}

function bstSnapshot(root, highlighted, message) {
  if (!root) return { nodes: [], edges: [], message };

  const nodes = [];
  const edges = [];
  let xCounter = 0;

  function traverse(node, depth, parentId) {
    if (!node) return;
    traverse(node.left, depth + 1, node.id);
    node.layoutX = xCounter++;
    node.layoutY = depth;
    nodes.push({
      id: node.id,
      value: node.value,
      layoutX: node.layoutX,
      layoutY: node.layoutY,
      state: highlighted[node.id] || 'normal',
      color: null,
    });
    if (parentId !== null) edges.push({ from: parentId, to: node.id });
    traverse(node.right, depth + 1, node.id);
  }

  traverse(root, 0, null);
  return { nodes, edges, message };
}

export function bstInsertSteps(root, value) {
  const steps = [];
  const newNode = new BSTNode(value);

  if (!root) {
    root = newNode;
    steps.push(bstSnapshot(root, { [root.id]: 'inserted' }, `Inserted ${value} as root`));
    return { steps, newRoot: root };
  }

  let current = root;
  const path = [];

  while (current) {
    path.push(current.id);
    const hl = {};
    path.slice(0, -1).forEach((id) => { hl[id] = 'path'; });
    hl[current.id] = 'comparing';

    if (value === current.value) {
      steps.push(bstSnapshot(root, hl, `${value} already exists in the tree`));
      return { steps, newRoot: root };
    }

    const goLeft = value < current.value;
    steps.push(bstSnapshot(root, hl, `Is ${value} < ${current.value}? ${goLeft}. Go ${goLeft ? 'left' : 'right'}.`));

    if (goLeft) {
      if (!current.left) {
        current.left = newNode;
        const hl2 = {};
        path.forEach((id) => { hl2[id] = 'path'; });
        hl2[newNode.id] = 'inserted';
        steps.push(bstSnapshot(root, hl2, `Inserted ${value}`));
        return { steps, newRoot: root };
      }
      current = current.left;
    } else {
      if (!current.right) {
        current.right = newNode;
        const hl2 = {};
        path.forEach((id) => { hl2[id] = 'path'; });
        hl2[newNode.id] = 'inserted';
        steps.push(bstSnapshot(root, hl2, `Inserted ${value}`));
        return { steps, newRoot: root };
      }
      current = current.right;
    }
  }

  return { steps, newRoot: root };
}

export function bstSearchSteps(root, value) {
  const steps = [];

  if (!root) {
    steps.push({ nodes: [], edges: [], message: 'Tree is empty' });
    steps.push({ nodes: [], edges: [], message: '' });
    return { steps };
  }

  let current = root;
  const path = [];

  while (current) {
    path.push(current.id);
    const hl = {};
    path.slice(0, -1).forEach((id) => { hl[id] = 'path'; });

    if (value === current.value) {
      hl[current.id] = 'found';
      steps.push(bstSnapshot(root, hl, `Found ${value}!`));
      steps.push(bstSnapshot(root, {}, ''));
      return { steps };
    }

    hl[current.id] = 'comparing';
    const goLeft = value < current.value;
    steps.push(bstSnapshot(root, hl, `Is ${value} < ${current.value}? ${goLeft}. Go ${goLeft ? 'left' : 'right'}.`));

    current = goLeft ? current.left : current.right;
  }

  const hl = {};
  path.forEach((id) => { hl[id] = 'path'; });
  steps.push(bstSnapshot(root, hl, `${value} not found`));
  steps.push(bstSnapshot(root, {}, ''));
  return { steps };
}

export function bstDeleteSteps(root, value) {
  const steps = [];

  if (!root) {
    steps.push({ nodes: [], edges: [], message: 'Tree is empty' });
    steps.push({ nodes: [], edges: [], message: '' });
    return { steps, newRoot: null };
  }

  function deleteNode(node, val, path) {
    if (!node) {
      const hl = {};
      path.forEach((id) => { hl[id] = 'path'; });
      steps.push(bstSnapshot(root, hl, `${val} not found`));
      return null;
    }

    const currentPath = [...path, node.id];
    const hl = {};
    currentPath.slice(0, -1).forEach((id) => { hl[id] = 'path'; });
    hl[node.id] = 'comparing';

    if (val < node.value) {
      steps.push(bstSnapshot(root, hl, `Is ${val} < ${node.value}? Yes. Go left.`));
      node.left = deleteNode(node.left, val, currentPath);
    } else if (val > node.value) {
      steps.push(bstSnapshot(root, hl, `Is ${val} < ${node.value}? No. Go right.`));
      node.right = deleteNode(node.right, val, currentPath);
    } else {
      hl[node.id] = 'found';

      if (!node.left && !node.right) {
        steps.push(bstSnapshot(root, hl, `Deleting ${val} (leaf node)`));
        return null;
      } else if (!node.left) {
        steps.push(bstSnapshot(root, hl, `Deleting ${val}: replacing with right child`));
        return node.right;
      } else if (!node.right) {
        steps.push(bstSnapshot(root, hl, `Deleting ${val}: replacing with left child`));
        return node.left;
      } else {
        let successor = node.right;
        while (successor.left) successor = successor.left;
        hl[successor.id] = 'comparing';
        steps.push(bstSnapshot(root, hl, `Deleting ${val}: inorder successor is ${successor.value}`));
        node.value = successor.value;
        steps.push(bstSnapshot(root, hl, `Replaced with ${successor.value}, now removing successor`));
        node.right = deleteNode(node.right, successor.value, currentPath);
      }
    }
    return node;
  }

  const newRoot = deleteNode(root, value, []);
  steps.push(bstSnapshot(newRoot, {}, ''));
  return { steps, newRoot };
}

// ============================================================
// Red-Black Tree
// ============================================================

const RED = 'red';
const BLACK = 'black';

class RBTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = RED;
    this.isNil = false;
    this.id = `rbt-${value}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }
}

function rbtSnapshot(tree, highlighted, message) {
  const nodes = [];
  const edges = [];
  let xCounter = 0;

  function traverse(node, depth) {
    if (!node || node.isNil) return;
    traverse(node.left, depth + 1);
    node.layoutX = xCounter++;
    node.layoutY = depth;
    nodes.push({
      id: node.id,
      value: node.value,
      layoutX: node.layoutX,
      layoutY: node.layoutY,
      color: node.color,
      state: highlighted[node.id] || 'normal',
    });
    if (node.parent && !node.parent.isNil) {
      edges.push({ from: node.parent.id, to: node.id });
    }
    traverse(node.right, depth + 1);
  }

  traverse(tree.root, 0);
  return { nodes, edges, message };
}

export class RedBlackTree {
  constructor() {
    this.nil = new RBTNode(null);
    this.nil.color = BLACK;
    this.nil.isNil = true;
    this.nil.left = this.nil;
    this.nil.right = this.nil;
    this.nil.parent = this.nil;
    this.root = this.nil;
  }

  _leftRotate(x) {
    const y = x.right;
    x.right = y.left;
    if (y.left !== this.nil) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent === this.nil) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  _rightRotate(y) {
    const x = y.left;
    y.left = x.right;
    if (x.right !== this.nil) x.right.parent = y;
    x.parent = y.parent;
    if (y.parent === this.nil) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }
    x.right = y;
    y.parent = x;
  }

  insertSteps(value) {
    const steps = [];
    const snap = (hl, msg) => steps.push(rbtSnapshot(this, hl, msg));

    const z = new RBTNode(value);
    z.left = this.nil;
    z.right = this.nil;

    let y = this.nil;
    let x = this.root;
    const path = [];

    while (x !== this.nil) {
      path.push(x.id);
      y = x;
      const hl = {};
      path.slice(0, -1).forEach((id) => { hl[id] = 'path'; });
      hl[x.id] = 'comparing';

      if (value === x.value) {
        snap(hl, `${value} already exists`);
        return { steps };
      }

      const goLeft = value < x.value;
      snap(hl, `Is ${value} < ${x.value}? ${goLeft}. Go ${goLeft ? 'left' : 'right'}.`);
      x = goLeft ? x.left : x.right;
    }

    z.parent = y;
    if (y === this.nil) {
      this.root = z;
    } else if (value < y.value) {
      y.left = z;
    } else {
      y.right = z;
    }

    const insertHl = {};
    path.forEach((id) => { insertHl[id] = 'path'; });
    insertHl[z.id] = 'inserted';
    snap(insertHl, `Inserted ${value} as red node`);

    this._insertFixupSteps(z, steps);
    this.root.color = BLACK;
    snap({}, '');

    return { steps };
  }

  _insertFixupSteps(z, steps) {
    const snap = (hl, msg) => steps.push(rbtSnapshot(this, hl, msg));

    while (z.parent && z.parent !== this.nil && z.parent.color === RED) {
      const grandparent = z.parent.parent;
      if (!grandparent || grandparent === this.nil) break;

      if (z.parent === grandparent.left) {
        const uncle = grandparent.right;

        if (uncle !== this.nil && uncle.color === RED) {
          const hl = {};
          hl[z.id] = 'comparing';
          hl[z.parent.id] = 'comparing';
          hl[uncle.id] = 'comparing';
          hl[grandparent.id] = 'comparing';
          snap(hl, `Case 1: Uncle is red → recolor parent & uncle to black, grandparent to red`);
          z.parent.color = BLACK;
          uncle.color = BLACK;
          grandparent.color = RED;
          z = grandparent;
          snap({ [z.id]: 'comparing' }, `Recolored. Move up to grandparent.`);
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            snap({ [z.id]: 'comparing' }, `Case 2: Left-rotate on ${z.value}`);
            this._leftRotate(z);
            snap({ [z.parent.id]: 'comparing' }, `After left-rotate`);
          }
          z.parent.color = BLACK;
          grandparent.color = RED;
          snap(
            { [z.id]: 'comparing', [z.parent.id]: 'comparing', [grandparent.id]: 'comparing' },
            `Case 3: Right-rotate on ${grandparent.value}`
          );
          this._rightRotate(grandparent);
          snap({}, `After right-rotate`);
        }
      } else {
        const uncle = grandparent.left;

        if (uncle !== this.nil && uncle.color === RED) {
          const hl = {};
          hl[z.id] = 'comparing';
          hl[z.parent.id] = 'comparing';
          hl[uncle.id] = 'comparing';
          hl[grandparent.id] = 'comparing';
          snap(hl, `Case 1 (mirror): Uncle is red → recolor`);
          z.parent.color = BLACK;
          uncle.color = BLACK;
          grandparent.color = RED;
          z = grandparent;
          snap({ [z.id]: 'comparing' }, `Recolored. Move up.`);
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            snap({ [z.id]: 'comparing' }, `Case 2 (mirror): Right-rotate on ${z.value}`);
            this._rightRotate(z);
            snap({ [z.parent.id]: 'comparing' }, `After right-rotate`);
          }
          z.parent.color = BLACK;
          grandparent.color = RED;
          snap(
            { [z.id]: 'comparing', [z.parent.id]: 'comparing', [grandparent.id]: 'comparing' },
            `Case 3 (mirror): Left-rotate on ${grandparent.value}`
          );
          this._leftRotate(grandparent);
          snap({}, `After left-rotate`);
        }
      }

      if (!z || z === this.root) break;
    }

    this.root.color = BLACK;
  }

  searchSteps(value) {
    const steps = [];
    const snap = (hl, msg) => steps.push(rbtSnapshot(this, hl, msg));

    if (this.root === this.nil) {
      snap({}, 'Tree is empty');
      snap({}, '');
      return { steps };
    }

    let current = this.root;
    const path = [];

    while (current !== this.nil) {
      path.push(current.id);
      const hl = {};
      path.slice(0, -1).forEach((id) => { hl[id] = 'path'; });

      if (value === current.value) {
        hl[current.id] = 'found';
        snap(hl, `Found ${value}!`);
        snap({}, '');
        return { steps };
      }

      hl[current.id] = 'comparing';
      const goLeft = value < current.value;
      snap(hl, `Is ${value} < ${current.value}? ${goLeft}. Go ${goLeft ? 'left' : 'right'}.`);
      current = goLeft ? current.left : current.right;
    }

    const hl = {};
    path.forEach((id) => { hl[id] = 'path'; });
    snap(hl, `${value} not found`);
    snap({}, '');
    return { steps };
  }
}
