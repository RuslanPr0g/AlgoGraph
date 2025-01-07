export interface Node extends d3.SimulationNodeDatum {
    id: number;
    name: string;
    topic: string;
  }
  
  export interface Link {
    source: number;
    target: number;
  }
  