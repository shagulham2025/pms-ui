
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface WeeklyDay {
  day: string;
  available: boolean;
  slots: Array<{ startTime: string; endTime: string }>;
}

@Component({
  standalone: false,
  selector: 'app-docter-availability-component',
  templateUrl: './docter-availability-component.html'
})
export class DocterAvailabilityComponent implements OnInit {
  name = '';
  schedule: WeeklyDay[] = [];

  constructor(
    private dialogRef: MatDialogRef<DocterAvailabilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; schedule: WeeklyDay[] }
  ) {}

  ngOnInit(): void {
    this.name = this.data?.name ?? '';
    this.schedule = this.data?.schedule ?? [];
  }

  close() {
    this.dialogRef.close();
  }

  formatSlots(slots: WeeklyDay['slots']) {
    if (!slots || !slots.length) return '—';
    return slots.map(s => `${s.startTime} - ${s.endTime}`).join(', ');
  }

}
