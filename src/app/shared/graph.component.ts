import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { GraphService } from './graph.service';
import { Link, Node, TopicNode } from './models';

@Component({
  selector: 'app-graph',
  standalone: true,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  @ViewChild('graphContainer', { static: true })
  graphContainer!: ElementRef<HTMLElement>;

  nodes: TopicNode[] = [];
  links: Link[] = [];
  width: number = window.innerWidth;
  height: number = window.innerHeight;

  simulation?: d3.Simulation<d3.SimulationNodeDatum, undefined>;

  private expandedNodes = new Set<number>(); // Tracks expanded nodes

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
    this.nodes = this.graphService.getTopicNodes().map((node, index) => ({
      ...node,
      difficulty: index, // Assign difficulty based on order or any logic
    }));
    this.links = this.graphService.getLinks(this.nodes);
    this.createGraph(this.nodes, this.links, this.graphContainer.nativeElement);
  }

  private createGraph(
    nodes: TopicNode[],
    links: Link[],
    container: HTMLElement
  ): void {
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('background-color', '#121212');

    // Create a color scale for difficulty
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, nodes.length - 1])
      .range(['#ADD8E6', '#00008B']); // Light blue to dark blue

    this.simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    this.updateGraph(container, colorScale);
  }

  private onTopicNodeClick(node: TopicNode, container: HTMLElement): void {
    if (this.expandedNodes.has(node.id)) {
      this.collapseNode(node);
    } else {
      this.expandNode(node);
    }
    this.updateGraph(container);
  }

  private expandNode(node: TopicNode): void {
    const relatedProblems = this.graphService.getProblemsForTopic(node.topic);

    const newTopicNodes = relatedProblems.map((problem, index) => ({
      id: this.nodes.length + index, // Ensure unique IDs
      topic: problem.name,
      x: node.x, // Start new nodes near the clicked node
      y: node.y,
      difficulty: node.difficulty + 1, // Increase difficulty for new nodes
    } as TopicNode));

    const newLinks = newTopicNodes.map((newNode) => ({
      source: node.id,
      target: newNode.id,
    } as Link));

    this.nodes = [...this.nodes, ...newTopicNodes];
    this.links = [...this.links, ...newLinks];
    this.expandedNodes.add(node.id);
  }

  private collapseNode(node: TopicNode): void {
    const connectedLinks = this.links.filter(
      (link) => link.source === node.id || link.target === node.id
    );

    const connectedNodeIds = connectedLinks.map((link) =>
      link.source === node.id ? link.target : link.source
    ) as number[];

    this.nodes = this.nodes.filter((n) => !connectedNodeIds.includes(n.id));
    this.links = this.links.filter(
      (link) => link.source !== node.id && link.target !== node.id
    );

    // TODO: the removal of the subgraph doersnt work, uncomment this when it works
    // this.expandedNodes.delete(node.id);
  }

  private updateGraph(container: HTMLElement, colorScale?: d3.ScaleLinear<string, string>): void {
    const svg = d3.select(container).select('svg');

    const link = svg
      .selectAll('.link')
      .data(this.links)
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('class', 'link')
            .attr('stroke', '#4a4a4a')
            .attr('stroke-width', 2),
        (update) => update,
        (exit) => exit.remove()
      );

    const nodeSelection = svg
      .selectAll('.node')
      .data(this.nodes)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', 'node')
            .attr('r', 20)
            .attr('fill', (d: any) => colorScale?.(d.difficulty) || '#1f77b4')
            .attr('cursor', 'pointer')
            .call(
              d3
                .drag<SVGCircleElement, TopicNode>()
                .on('start', (event, d) =>
                  this.graphService.dragStarted(event, d, this.simulation)
                )
                .on('drag', (event, d) => this.graphService.dragging(event, d))
                .on('end', (event, d) =>
                  this.graphService.dragEnded(event, d, this.simulation)
                )
            )
            .on('click', (event, d) => this.onTopicNodeClick(d, container)),
        (update) =>
          update.attr('fill', (d: any) => colorScale?.(d.difficulty) || '#1f77b4'),
        (exit) => exit.remove()
      );

    const labels = svg
      .selectAll('.node-label')
      .data(this.nodes)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', 'node-label')
            .attr('dx', 5)
            .attr('dy', 5)
            .attr('font-size', '16px')
            .attr('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-family', 'Arial, sans-serif')
            .style('text-shadow', '1px 1px 3px rgba(0, 0, 0, 0.5)')
            .text((d: any) => d.topic),
        (update) => update,
        (exit) => exit.remove()
      );

    this.simulation?.nodes(this.nodes as any);
    this.simulation?.force(
      'link',
      d3
        .forceLink(this.links)
        .id((d: any) => d.id)
        .distance(150)
    );
    this.simulation?.alpha(1).restart();

    this.simulation?.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeSelection.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      labels.attr('x', (d: any) => d.x + 25).attr('y', (d: any) => d.y + 5);
    });
  }
}
