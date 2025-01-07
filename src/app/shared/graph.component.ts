import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Link, TopicNode, Node } from './models';
import { GraphDataService } from './graph-data.service';

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
  private colorScale?: d3.ScaleLinear<string, string, never>;

  private expandedNodes = new Set<number>(); // Tracks expanded nodes

  constructor(private graphDataService: GraphDataService) {}

  ngOnInit(): void {
    this.nodes = this.graphDataService.getTopicNodes();
    this.links = this.graphDataService.getLinks(this.nodes);
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
    this.colorScale = d3
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

    this.updateGraph(container, this.colorScale);
  }

  private onTopicNodeClick(node: TopicNode, container: HTMLElement): void {
    if (node.type === 'parent') {
      if (this.expandedNodes.has(node.id)) {
        this.collapseNode(node);
      } else {
        this.expandNode(node);
      }
      this.updateGraph(container, this.colorScale);
    } else {
      alert('IT IS A CHILD');
    }
  }

  private expandNode(node: TopicNode): void {
    const relatedProblems = this.graphDataService.getProblemsForTopic(
      node.topic
    );

    const newTopicNodes = relatedProblems.map(
      (problem, index) =>
        ({
          id: this.nodes.length + index, // Ensure unique IDs
          topic: problem.name,
          type: problem.type,
          x: node.x, // Start new nodes near the clicked node
          y: node.y,
          difficulty: node.difficulty + 1, // Increase difficulty for new nodes
        } as TopicNode)
    );

    const newLinks = newTopicNodes.map(
      (newNode) =>
        ({
          source: node.id,
          target: newNode.id,
        } as Link)
    );

    this.nodes = [...this.nodes, ...newTopicNodes];
    this.links = [...this.links, ...newLinks];
    this.expandedNodes.add(node.id);
    this.updateGraph(this.graphContainer.nativeElement, this.colorScale); // Re-render the graph to update colors
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

    // this.expandedNodes.delete(node.id);
    this.updateGraph(this.graphContainer.nativeElement, this.colorScale); // Re-render the graph to update colors
  }

  private updateGraph(
    container: HTMLElement,
    colorScale?: d3.ScaleLinear<string, string>
  ): void {
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

    const getColorForNode = (node: TopicNode) => {
      return node.type === 'child'
        ? '#727D73'
        : colorScale?.(node.difficulty) || '#1f77b4';
    };

    const getSizeForNode = (node: TopicNode) => {
      return node.type === 'child' ? 20 : 25;
    };

    const nodeSelection = svg
      .selectAll('.node')
      .data(this.nodes)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', 'node')
            .attr('r', (d: any) => getSizeForNode(d))
            .attr('fill', (d: any) => getColorForNode(d))
            .attr('cursor', 'pointer')
            .call(
              d3
                .drag<SVGCircleElement, TopicNode>()
                .on('start', (event, d) =>
                  this.dragStarted(event, d, this.simulation)
                )
                .on('drag', (event, d) => this.dragging(event, d))
                .on('end', (event, d) =>
                  this.dragEnded(event, d, this.simulation)
                )
            )
            .on('click', (event, d) => this.onTopicNodeClick(d, container)),
        (update) => update.attr('fill', (d: any) => getColorForNode(d)),
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
            .attr('font-family', 'Press Start 2P')
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
}
