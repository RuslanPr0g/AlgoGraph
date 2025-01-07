export interface Node extends d3.SimulationNodeDatum {
  id: number;
  name: string;
}

export interface TopicNode extends Node {
  topic: string;
}

export interface Link {
  source: number;
  target: number;
}
