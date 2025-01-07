import { Injectable } from '@angular/core';
import { Link, Node } from './models';
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
    'Dynamic Programming'
  ];

  getRandomTopic(): string {
    return this.topics[Math.floor(Math.random() * this.topics.length)];
  }

  getNodes(): Node[] {
    return this.topics.map((topic, index) => ({
      id: index + 1,
      name: `Node ${index + 1}`,
      topic: topic,
      x: Math.random() * window.innerWidth, // Responsive random initial position
      y: Math.random() * window.innerHeight, // Responsive random initial position
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }));
  }

  getLinks(nodes: Node[]): Link[] {
    return nodes.map((node, index) => {
      if (index < nodes.length - 1) {
        return { source: node.id, target: nodes[index + 1].id };
      }
      return null;
    }).filter(link => link !== null) as Link[];
  }

  createLinks(svg: d3.Selection<SVGElement, any, any, any>, links: Link[]): void {
    svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#999');
  }

  createNodes(svg: d3.Selection<SVGElement, any, any, any>, nodes: Node[], simulation: any): void {
    const node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 20)
      .attr('fill', '#69b3a2')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', (event, d) => this.dragStarted(event, d, simulation))
        .on('drag', (event, d) => this.dragging(event, d))
        .on('end', (event, d) => this.dragEnded(event, d, simulation)))
      .on('click', (event, d) => this.onNodeClick(d));
  
    node.append('title')
      .text((d: any) => d.name);
  
    // Add topic label to each node (now it shows the topic)
    node.append('text')
      .attr('dx', 25)  // Adjust horizontal position
      .attr('dy', 5)   // Adjust vertical position
      .attr('font-size', '12px')
      .attr('fill', 'black')  // Text color
      .text((d: any) => d.topic);  // Display the topic on the node
  }
  

  updateLinks(svg: d3.Selection<SVGElement, any, any, any>, links: Link[]): void {
    svg.selectAll('.link')
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);
  }

  updateNodes(svg: d3.Selection<SVGElement, any, any, any>, nodes: Node[]): void {
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

  onNodeClick(node: Node): void {
    alert(`Node ID: ${node.id}\nNode Name: ${node.name}\nTopic: ${node.topic}`);
  }
}
