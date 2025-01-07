export interface Node extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  type: 'parent' | 'child';
}

export interface TopicNode extends Node {
  topic: string;
  difficulty: number;
}

export interface Link {
  source: number;
  target: number;
}
