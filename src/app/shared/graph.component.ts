import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Link, GraphNode } from './models';
import { GraphDataService } from './graph-data.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { GraphModalComponent } from './graph-modal/graph-modal.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-graph',
  standalone: true,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  imports: [CommonModule],
})
export class GraphComponent implements OnInit {
  @ViewChild('graphContainer', { static: true })
  graphContainer!: ElementRef<HTMLElement>;

  nodes: GraphNode[] = [];
  links: Link[] = [];
  savedPositions: Record<number, { x: number; y: number }> = {};
  width: number = window.innerWidth;
  height: number = window.innerHeight;

  simulation?: d3.Simulation<d3.SimulationNodeDatum, undefined>;
  private colorScale?: d3.ScaleLinear<string, string, never>;

  private expandedNodes = new Set<number>();

  constructor(
    private graphDataService: GraphDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.updateData();
    this.createGraph(this.nodes, this.links, this.graphContainer.nativeElement);
  }

  private updateData(): void {
    this.nodes = this.graphDataService.getGraphNodes();

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    const maxRadius = Math.min(this.width, this.height) / 2 - 50;
    const angleStep = (2 * Math.PI) / this.nodes.length;

    this.nodes.forEach((node, index) => {
      const radius = (index / this.nodes.length) * maxRadius;
      const angle = index * angleStep;

      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);

      this.savedPositions[node.id] = { x: node.x, y: node.y };
    });

    this.links = this.graphDataService.getLinks(this.nodes);
  }

  private createGraph(
    nodes: GraphNode[],
    links: Link[],
    container: HTMLElement
  ): void {
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => svg.attr('transform', event.transform)) as any;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('background-color', '#121212')
      .call(zoom)
      .append('g');

    const initialScale = 0.6;
    const initialTranslate: [number, number] = [
      this.width / 4,
      this.height / 4,
    ];
    svg.attr(
      'transform',
      `translate(${initialTranslate[0]}, ${initialTranslate[1]}) scale(${initialScale})`
    );

    d3.select(container)
      .select('svg')
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(...initialTranslate).scale(initialScale)
      );

    this.colorScale = d3
      .scaleLinear<string>()
      .domain([0, nodes.length - 1])
      .range(['#ADD8E6', '#00008B']);

    this.simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d: any) => (d.source.type === 'parent' ? 500 : 50))
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    this.updateGraph(container, this.colorScale);
  }

  private rebuildGraph(node: GraphNode, container: HTMLElement): void {
    this.collapseNodes();
    this.expandNode(node);
    this.updateGraph(container, this.colorScale);
  }

  private onGraphNodeClick(node: GraphNode, container: HTMLElement): void {
    if (node.type === 'parent') {
      this.rebuildGraph(node, container);
    } else {
      const dialogRef = this.dialog.open(GraphModalComponent, {
        data: {
          node,
        },
        width: '70%',
        height: '50%',
      });

      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe(() => {
          this.updateData();

          this.simulation?.nodes(this.nodes as any);
          this.simulation?.force(
            'link',
            d3
              .forceLink(this.links)
              .id((d: any) => d.id)
              .distance((d: any) => (d.source.type === 'parent' ? 500 : 50))
          );
          this.simulation?.alpha(1).restart();

          this.updateGraph(container, this.colorScale);
        });
    }
  }

  private expandNode(node: GraphNode): void {
    const relatedProblems = this.graphDataService.getProblemsForTopic(
      node.name
    );

    const numNewNodes = relatedProblems.length;
    const radius = 400;
    const angleStep = (2 * Math.PI) / numNewNodes;

    const newGraphNodes = relatedProblems.map((child, index) => {
      const angle = index * angleStep;

      return {
        id: this.nodes.length + index,
        name: child.name,
        type: child.type,
        x: node?.x ?? 0 + radius * Math.cos(angle),
        y: node?.y ?? 0 + radius * Math.sin(angle),
        difficulty: node.id + 1,
        problem: child.problem,
        parentNode: node,
      } as GraphNode;
    });

    const graphNodesToLink = newGraphNodes;

    const newLinks = graphNodesToLink.map(
      (newNode) =>
        ({
          source: node,
          target: newNode,
        } as Link)
    );

    this.nodes = [...this.nodes, ...graphNodesToLink];
    this.links = [...this.links, ...newLinks];
    this.expandedNodes.add(node.id);

    this.updateGraph(this.graphContainer.nativeElement, this.colorScale);

    this.simulation?.nodes(this.nodes as any);
    this.simulation?.force(
      'link',
      d3
        .forceLink(this.links)
        .id((d: any) => d.id)
        .distance((d: any) => (d.source.type === 'parent' ? 500 : 50))
    );
    this.simulation?.alpha(1).restart();
  }

  private collapseNodes(): void {
    this.links = this.links.filter(
      (l) => l.source.type === 'parent' && l.target.type === 'parent'
    );
    this.nodes = this.nodes.filter((n) => n.type === 'parent');
    this.expandedNodes.clear();
  }

  private updateGraph(
    container: HTMLElement,
    colorScale?: d3.ScaleLinear<string, string>
  ): void {
    const svg = d3.select(container).select('svg');
    const graphGroup = svg.select('g');

    const link = graphGroup
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

    const getColorForNode = (node: GraphNode) => {
      return node.type === 'child'
        ? node.problem?.status === 'todo'
          ? '#727D73'
          : '#1f4529'
        : colorScale?.(node.id) || '#1f77b4';
    };

    const getSizeForNode = (node: GraphNode) => {
      return node.type === 'child' ? 20 : 25;
    };

    const nodeSelection = graphGroup
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
                .drag<SVGCircleElement, GraphNode>()
                .on('start', (event, d) =>
                  this.dragStarted(event, d, this.simulation)
                )
                .on('drag', (event, d) => this.dragging(event, d))
                .on('end', (event, d) =>
                  this.dragEnded(event, d, this.simulation)
                )
            )
            .on('click', (event, d) => this.onGraphNodeClick(d, container)),
        (update) => update.attr('fill', (d: any) => getColorForNode(d)),
        (exit) => exit.remove()
      );

    const labels = graphGroup
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
            .text((d: any) => d.name),
        (update) => update,
        (exit) => exit.remove()
      );

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

    if (d.x !== undefined && d.y !== undefined) {
      this.savedPositions[d.id] = { x: d.x, y: d.y };
    }
  }
}
