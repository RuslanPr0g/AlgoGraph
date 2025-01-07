export interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  type: 'parent' | 'child';
  problem?: Problem;
}

export interface Link {
  source: number;
  target: number;
}

export interface Problem {
  name: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'todo' | 'done';
  number: string;
}
