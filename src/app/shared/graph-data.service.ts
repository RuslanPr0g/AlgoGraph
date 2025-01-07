import { Injectable } from '@angular/core';
import { GraphNode, Link } from './models';
import { ProblemService } from './problem.service';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {
  constructor(private problemService: ProblemService) {}

  getGraphNodes(): GraphNode[] {
    return this.problemService.topics.map((topic, index) => ({
      id: index,
      name: topic,
      type: 'parent',
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }));
  }

  getLinks(nodes: GraphNode[]): Link[] {
    return nodes
      .map((node, index) => {
        if (index < nodes.length - 1) {
          return { source: node, target: nodes[index + 1] };
        }
        return null;
      })
      .filter((link) => link !== null) as Link[];
  }

  getProblemsForTopic(topic: string): GraphNode[] {
    let problems = this.problemService.problems[topic];

    if (!problems || problems?.length === 0) {
      return [];
    }

    const solvedProblems = this.problemService.getSolvedProblems();

    problems = problems.map((p) => ({
      ...p,
      status: solvedProblems.includes(p.number) ? 'done' : 'todo',
    }));

    return problems.map((problem) => ({
      id: parseFloat(problem.number),
      name: problem.name,
      type: 'child',
      problem: problem,
    }));
  }
}
