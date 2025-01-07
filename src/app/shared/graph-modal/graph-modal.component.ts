import { Component, inject, Input, model } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { GraphNode, Problem } from '../models';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { PrimaryButtonComponent } from '../../common/components/primary-button/primary-button.component';
import { ProblemService } from '../problem.service';

export interface GraphDialogData {
  node: GraphNode;
}

@Component({
  selector: 'app-graph-modal',
  standalone: true,
  templateUrl: './graph-modal.component.html',
  styleUrls: ['./graph-modal.component.scss'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    PrimaryButtonComponent,
  ],
})
export class GraphModalComponent {
  readonly problemService = inject(ProblemService);
  readonly dialogRef = inject(MatDialogRef<GraphModalComponent>);
  readonly data = inject<GraphDialogData>(MAT_DIALOG_DATA);
  readonly node = model(this.data.node);

  close() {
    this.dialogRef.close();
  }

  goSolve(): void {
    const url = this.node().problem?.url;
    console.warn(url);

    if (url) {
      window.open(url, '_blank');
    }
  }

  solve(): void {
    const problemNumber = this.node().problem?.number;
    if (problemNumber) {
      this.problemService.addSolvedProblem(problemNumber);
      this.updateProblemStatus('done');
    }
    this.close();
  }

  unsolve(): void {
    const problemNumber = this.node().problem?.number;
    if (problemNumber) {
      this.problemService.removeSolvedProblem(problemNumber);
      this.updateProblemStatus('todo');
    }
  }

  private updateProblemStatus(status: 'todo' | 'done'): void {
    const node = this.node();
    this.node.set({
      ...node,
      problem: {
        ...node.problem,
        status: status,
      } as Problem,
    });
  }
}
