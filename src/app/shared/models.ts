export interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  type: 'parent' | 'child';
  problem?: Problem;
  parentNode?: GraphNode;
}

export interface Link {
  source: GraphNode;
  target: GraphNode;
}

export interface Problem {
  name: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'todo' | 'done';
  number: string;
}
