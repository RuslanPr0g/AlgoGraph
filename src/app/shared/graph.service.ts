import { Injectable } from '@angular/core';
import { Link, Node, TopicNode } from './models';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  topics: string[] = [
    'Arrays & Strings',
    'Hashmaps & Sets',
    '2 Pointers',
    'Stacks',
    'Linked Lists',
    'Binary Search',
    'Sliding Window',
    'Trees',
    'Heaps',
    'Recursive Backtracking',
    'Graphs',
    'Dynamic Programming',
  ];

  problems: { [key: string]: Node[] } = {
    'Arrays & Strings': [
      { id: 1, name: 'Two Sum' },
      { id: 2, name: 'Best Time to Buy and Sell Stock' },
      { id: 3, name: 'Rotate Image' },
    ],
    'Hashmaps & Sets': [
      { id: 4, name: 'Contains Duplicate' },
      { id: 5, name: 'Group Anagrams' },
    ],
    '2 Pointers': [
      { id: 6, name: 'Container With Most Water' },
      { id: 7, name: '3Sum' },
    ],
    'Stacks': [
      { id: 8, name: 'Valid Parentheses' },
      { id: 9, name: 'Evaluate Reverse Polish Notation' },
    ],
    'Linked Lists': [
      { id: 10, name: 'Add Two Numbers' },
      { id: 11, name: 'Reverse Linked List' },
    ],
    'Binary Search': [
      { id: 12, name: 'Binary Search' },
      { id: 13, name: 'Search in Rotated Sorted Array' },
    ],
    'Sliding Window': [
      { id: 14, name: 'Longest Substring Without Repeating Characters' },
      { id: 15, name: 'Minimum Window Substring' },
    ],
    'Trees': [
      { id: 16, name: 'Maximum Depth of Binary Tree' },
      { id: 17, name: 'Validate Binary Search Tree' },
    ],
    'Heaps': [
      { id: 18, name: 'Merge k Sorted Lists' },
      { id: 19, name: 'Top K Frequent Elements' },
    ],
    'Recursive Backtracking': [
      { id: 20, name: 'Permutations' },
      { id: 21, name: 'Combination Sum' },
    ],
    'Graphs': [
      { id: 22, name: 'Number of Islands' },
      { id: 23, name: 'Clone Graph' },
    ],
    'Dynamic Programming': [
      { id: 24, name: 'Climbing Stairs' },
      { id: 25, name: 'House Robber' },
    ],
  };

  getRandomTopic(): string {
    return this.topics[Math.floor(Math.random() * this.topics.length)];
  }

  getTopicNodes(): TopicNode[] {
    return this.topics.map((topic, index) => ({
      id: index + 1,
      name: `TopicNode ${index + 1}`,
      topic: topic,
      difficulty: 0,
      x: Math.random() * window.innerWidth, // Responsive random initial position
      y: Math.random() * window.innerHeight, // Responsive random initial position
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }));
  }

  getLinks(nodes: TopicNode[]): Link[] {
    return nodes.map((node, index) => {
      if (index < nodes.length - 1) {
        return { source: node.id, target: nodes[index + 1].id };
      }
      return null;
    }).filter(link => link !== null) as Link[];
  }

  getProblemsForTopic(topic: string): Node[] {
    return this.problems[topic] || [];
  }

  createLinks(svg: d3.Selection<SVGElement, any, any, any>, links: Link[]): void {
    svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#999');
  }

  createTopicNodes(svg: d3.Selection<SVGElement, any, any, any>, nodes: TopicNode[], simulation: any): void {
    const node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 20)
      .attr('fill', '#69b3a2')
      .call(d3.drag<SVGCircleElement, TopicNode>()
        .on('start', (event, d) => this.dragStarted(event, d, simulation))
        .on('drag', (event, d) => this.dragging(event, d))
        .on('end', (event, d) => this.dragEnded(event, d, simulation)))
      .on('click', (event, d) => this.onTopicNodeClick(d));
  
    node.append('title')
      .text((d: any) => d.name);
  
    node.append('text')
      .attr('dx', 25)
      .attr('dy', 5)
      .attr('font-size', '12px')
      .attr('font-family', 'Press Start 2P')
      .attr('fill', 'black')
      .text((d: any) => d.topic);
  }

  updateLinks(svg: d3.Selection<SVGElement, any, any, any>, links: Link[]): void {
    svg.selectAll('.link')
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);
  }

  updateTopicNodes(svg: d3.Selection<SVGElement, any, any, any>, nodes: TopicNode[]): void {
    svg.selectAll('.node')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y);
  }

  dragStarted(event: any, d: any, simulation: any): void {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragging(event: any, d: any): void {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragEnded(event: any, d: any, simulation: any): void {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  onTopicNodeClick(node: TopicNode): void {
    const problems = this.getProblemsForTopic(node.topic);
    if (problems.length > 0) {
      alert(`Problems for ${node.topic}: \n${problems.map((p: any) => p.name).join('\n')}`);
    } else {
      alert(`No problems available for ${node.topic}`);
    }
  }
}
