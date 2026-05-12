const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const getDelay = (speed) => Math.max(50, 1100 - speed * 2);

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

export async function bstInsert(root, value, onStep, speed) {
  const delay = getDelay(speed);
  const newNode = new BSTNode(value);

  if (!root) {
    root = newNode;
    onStep(bstSnapshot(root, { [root.id]: 'inserted' }, `Inserted ${value} as root`));
    await sleep(delay);
    onStep(bstSnapshot(root, {}, ''));
    return root;
  }

  let current = root;
  const path = [];

  while (current) {
    path.push(current.id);
    const hl = {};
    path.slice(0, -1).forEach((id) => { hl[id] = 'path'; });
    hl[current.id] = 'comparing';

    if (value === current.value) {
      onStep(bstSnapshot(root, hl, `${value} already exists in the tree`));
      await sleep(delay);
      onStep(bstSnapshot(root, {}, ''));
      return root;
    }

    const goLeft = value < current.value;
    onStep(bstSnapshot(root, hl, `Is ${value} < ${current.value}? ${goLeft}. Go ${goLeft ? 'left' : 'right'}.`));
    await sleep(delay);

    if (goLeft) {
      if (!current.left) {
        current.left = newNode;
        const hl2 = {};
        path.forEach((id) => { hl2[id] = 'path'; });
        hl2[newNode.id] = 'inserted';
        onStep(bstSnapshot(root, hl2, `Inserted ${value}`));
        await sleep(delay);
        onStep(bstSnapshot(root, {}, ''));
        return root;
      }
      current = current.left;
    } else {
      if (!current.right) {
        current.right = newNode;
        const hl2 = {};
        path.forEach((id) => { hl2[id] = 'path'; });
        hl2[newNode.id] = 'inserted';
        onStep(bstSnapshot(root, hl2, `Inserted ${value}`));
        await sleep(delay);
        onStep(bstSnapshot(root, {}, ''));
        return root;
      }
      current = current.right;
    }
  }

  return root;
}

export async function bstSearch(root, value, onStep, speed) {
  const delay = getDelay(speed);

  if (!root) {
    onStep({ nodes: [], edges: [], message: 'Tree is empty' });
    await sleep(delay);
    onStep({ nodes: [], edges: [], message: '' });
    return false;
  }

  let current = root;
  const path = [];

  while (current) {
    path.push(current.id);
    const hl = {};
    path.slice(0, -1).forEach((id) => { hl[id] = 'path'; });

    if (value === current.value) {
      hl[current.id] = 'found';
      onStep(bstSnapshot(root, hl, `Found ${value}!`));
      await sleep(delay * 2);
      onStep(bstSnapshot(root, {}, ''));
      return true;
    }

    hl[current.id] = 'comparing';
    const goLeft = value < current.value;
    onStep(bstSnapshot(root, hl, `Is ${value} < ${current.value}? ${goLeft}. Go ${goLeft ? 'left' : 'right'}.`));
    await sleep(delay);

    current = goLeft ? current.left : current.right;
  }

  const hl = {};
  path.forEach((id) => { hl[id] = 'path'; });
  onStep(bstSnapshot(root, hl, `${value} not found`));
  await sleep(delay);
  onStep(bstSnapshot(root, {}, ''));
  return false;
}

export async function bstDelete(root, value, onStep, speed) {
  const delay = getDelay(speed);

  if (!root) {
    onStep({ nodes: [], edges: [], message: 'Tree is empty' });
    await sleep(delay);
    onStep({ nodes: [], edges: [], message: '' });
    return null;
  }

  async function deleteNode(node, val, path) {
    if (!node) {
      const hl = {};
      path.forEach((id) => { hl[id] = 'path'; });
      onStep(bstSnapshot(root, hl, `${val} not found`));
      await sleep(delay);
      return null;
    }

    const currentPath = [...path, node.id];
    const hl = {};
    currentPath.slice(0, -1).forEach((id) => { hl[id] = 'path'; });
    hl[node.id] = 'comparing';

    if (val < node.value) {
      onStep(bstSnapshot(root, hl, `Is ${val} < ${node.value}? Yes. Go left.`));
      await sleep(delay);
      node.left = await deleteNode(node.left, val, currentPath);
    } else if (val > node.value) {
      onStep(bstSnapshot(root, hl, `Is ${val} < ${node.value}? No. Go right.`));
      await sleep(delay);
      node.right = await deleteNode(node.right, val, currentPath);
    } else {
      hl[node.id] = 'found';

      if (!node.left && !node.right) {
        onStep(bstSnapshot(root, hl, `Deleting ${val} (leaf node)`));
        await sleep(delay);
        return null;
      } else if (!node.left) {
        onStep(bstSnapshot(root, hl, `Deleting ${val}: replacing with right child`));
        await sleep(delay);
        return node.right;
      } else if (!node.right) {
        onStep(bstSnapshot(root, hl, `Deleting ${val}: replacing with left child`));
        await sleep(delay);
        return node.left;
      } else {
        // Two children: replace with inorder successor
        let successor = node.right;
        while (successor.left) successor = successor.left;
        hl[successor.id] = 'comparing';
        onStep(bstSnapshot(root, hl, `Deleting ${val}: inorder successor is ${successor.value}`));
        await sleep(delay);
        node.value = successor.value;
        onStep(bstSnapshot(root, hl, `Replaced with ${successor.value}, now removing successor`));
        await sleep(delay);
        node.right = await deleteNode(node.right, successor.value, currentPath);
      }
    }
    return node;
  }

  root = await deleteNode(root, value, []);
  onStep(bstSnapshot(root, {}, ''));
  return root;
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

  async insert(value, onStep, speed) {
    const delay = getDelay(speed);
    const snap = (hl, msg) => onStep(rbtSnapshot(this, hl, msg));

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
        await sleep(delay);
        snap({}, '');
        return;
      }

      const goLeft = value < x.value;
      snap(hl, `Is ${value} < ${x.value}? ${goLeft}. Go ${goLeft ? 'left' : 'right'}.`);
      await sleep(delay);
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
    await sleep(delay);

    await this._insertFixup(z, onStep, speed);
    this.root.color = BLACK;
    snap({}, '');
  }

  async _insertFixup(z, onStep, speed) {
    const delay = getDelay(speed);
    const snap = (hl, msg) => onStep(rbtSnapshot(this, hl, msg));

    while (z.parent && z.parent !== this.nil && z.parent.color === RED) {
      const grandparent = z.parent.parent;
      if (!grandparent || grandparent === this.nil) break;

      if (z.parent === grandparent.left) {
        const uncle = grandparent.right;

        if (uncle !== this.nil && uncle.color === RED) {
          // Case 1: uncle red → recolor
          const hl = {};
          hl[z.id] = 'comparing';
          hl[z.parent.id] = 'comparing';
          hl[uncle.id] = 'comparing';
          hl[grandparent.id] = 'comparing';
          snap(hl, `Case 1: Uncle is red → recolor parent & uncle to black, grandparent to red`);
          await sleep(delay);
          z.parent.color = BLACK;
          uncle.color = BLACK;
          grandparent.color = RED;
          z = grandparent;
          snap({ [z.id]: 'comparing' }, `Recolored. Move up to grandparent.`);
          await sleep(delay);
        } else {
          if (z === z.parent.right) {
            // Case 2: uncle black, z is right child → left rotate
            z = z.parent;
            snap({ [z.id]: 'comparing' }, `Case 2: Left-rotate on ${z.value}`);
            await sleep(delay);
            this._leftRotate(z);
            snap({ [z.parent.id]: 'comparing' }, `After left-rotate`);
            await sleep(delay);
          }
          // Case 3: uncle black, z is left child → right rotate
          z.parent.color = BLACK;
          grandparent.color = RED;
          snap(
            { [z.id]: 'comparing', [z.parent.id]: 'comparing', [grandparent.id]: 'comparing' },
            `Case 3: Right-rotate on ${grandparent.value}`
          );
          await sleep(delay);
          this._rightRotate(grandparent);
          snap({}, `After right-rotate`);
          await sleep(delay);
        }
      } else {
        // Mirror: z.parent is grandparent.right
        const uncle = grandparent.left;

        if (uncle !== this.nil && uncle.color === RED) {
          // Case 1 mirror
          const hl = {};
          hl[z.id] = 'comparing';
          hl[z.parent.id] = 'comparing';
          hl[uncle.id] = 'comparing';
          hl[grandparent.id] = 'comparing';
          snap(hl, `Case 1 (mirror): Uncle is red → recolor`);
          await sleep(delay);
          z.parent.color = BLACK;
          uncle.color = BLACK;
          grandparent.color = RED;
          z = grandparent;
          snap({ [z.id]: 'comparing' }, `Recolored. Move up.`);
          await sleep(delay);
        } else {
          if (z === z.parent.left) {
            // Case 2 mirror
            z = z.parent;
            snap({ [z.id]: 'comparing' }, `Case 2 (mirror): Right-rotate on ${z.value}`);
            await sleep(delay);
            this._rightRotate(z);
            snap({ [z.parent.id]: 'comparing' }, `After right-rotate`);
            await sleep(delay);
          }
          // Case 3 mirror
          z.parent.color = BLACK;
          grandparent.color = RED;
          snap(
            { [z.id]: 'comparing', [z.parent.id]: 'comparing', [grandparent.id]: 'comparing' },
            `Case 3 (mirror): Left-rotate on ${grandparent.value}`
          );
          await sleep(delay);
          this._leftRotate(grandparent);
          snap({}, `After left-rotate`);
          await sleep(delay);
        }
      }

      if (!z || z === this.root) break;
    }

    this.root.color = BLACK;
  }

  async search(value, onStep, speed) {
    const delay = getDelay(speed);
    const snap = (hl, msg) => onStep(rbtSnapshot(this, hl, msg));

    if (this.root === this.nil) {
      snap({}, 'Tree is empty');
      await sleep(delay);
      snap({}, '');
      return false;
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
        await sleep(delay * 2);
        snap({}, '');
        return true;
      }

      hl[current.id] = 'comparing';
      const goLeft = value < current.value;
      snap(hl, `Is ${value} < ${current.value}? ${goLeft}. Go ${goLeft ? 'left' : 'right'}.`);
      await sleep(delay);
      current = goLeft ? current.left : current.right;
    }

    const hl = {};
    path.forEach((id) => { hl[id] = 'path'; });
    snap(hl, `${value} not found`);
    await sleep(delay);
    snap({}, '');
    return false;
  }
}
