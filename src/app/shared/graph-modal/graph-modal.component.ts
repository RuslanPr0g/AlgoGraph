import { Component, inject, Input, model } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { TopicNode } from '../models';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

export interface GraphDialogData {
  node: TopicNode;
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
  ],
})
export class GraphModalComponent {
  readonly dialogRef = inject(MatDialogRef<GraphModalComponent>);
  readonly data = inject<GraphDialogData>(MAT_DIALOG_DATA);
  readonly node = model(this.data.node);

  @Input() selectedNode?: TopicNode;

  close() {
    this.dialogRef.close();
  }
}
