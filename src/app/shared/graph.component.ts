import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { GraphService } from './graph.service';
import { Link, Node } from './models';

@Component({
  selector: 'app-graph',
  standalone: true,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  @ViewChild('graphContainer', { static: true })
  graphContainer!: ElementRef<HTMLElement>;

  nodes: Node[] = [];
  links: Link[] = [];
  width: number = window.innerWidth;
  height: number = window.innerHeight;

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
    this.nodes = this.graphService.getNodes();
    this.links = this.graphService.getLinks(this.nodes);
    this.createGraph();
  }

  private createGraph(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    const svg = d3
      .select(this.graphContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#121212');

    const simulation = d3
      .forceSimulation(this.nodes as any)
      .force(
        'link',
        d3
          .forceLink(this.links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll('.link')
      .data(this.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#4a4a4a')
      .attr('stroke-width', 2);

    const node = svg
      .selectAll('.node')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 20)
      .attr('fill', '#1f77b4')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on('start', (event, d) => this.graphService.dragStarted(event, d, simulation))
          .on('drag', (event, d) => this.graphService.dragging(event, d))
          .on('end', (event, d) => this.graphService.dragEnded(event, d, simulation))
      )
      .on('click', (event, d) => this.graphService.onNodeClick(d));

    const labels = svg
      .selectAll('.node-label')
      .data(this.nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('dx', 5)
      .attr('dy', 5)
      .attr('font-size', '16px')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .style('font-weight', 'bold')
      .style('font-family', 'Arial, sans-serif')
      .style('text-shadow', '1px 1px 3px rgba(0, 0, 0, 0.5)')
      .text((d: any) => d.topic);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x + 25)
        .attr('y', (d: any) => d.y + 5);
    });
  }
}
