import { Injectable } from '@angular/core';
import { TopicNode, Link, Node } from './models';
import { ProblemService } from './problem.service';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {
  constructor(private problemService: ProblemService) {}

  getTopicNodes(): TopicNode[] {
    return this.problemService.topics.map((topic, index) => ({
      id: index + 1,
      name: `TopicNode ${index + 1}`,
      topic: topic,
      difficulty: index,
      type: 'parent',
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }));
  }

  getLinks(nodes: TopicNode[]): Link[] {
    return nodes
      .map((node, index) => {
        if (index < nodes.length - 1) {
          return { source: node.id, target: nodes[index + 1].id };
        }
        return null;
      })
      .filter((link) => link !== null) as Link[];
  }

  getProblemsForTopic(topic: string): Node[] {
    return this.problemService.problems[topic].map((problem, index) => ({
      id: index,
      name: problem,
      type: 'child',
    }));
  }
}
