import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { MessageService } from 'primeng/api';
import { PortalService } from '../../core/services/portal.service';
import { Severity } from '../../core/services/ui.service';
import { Appointment, AppointmentKind } from '../../core/models';

interface CalendarCell {
  date: Date | null;
  inMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

/**
 * Inspections, meetings and officer visits — as a list and as a month calendar,
 * because people think about appointments both ways.
 */
@Component({
  selector: 'app-appointments',
  imports: [DatePipe, LowerCasePipe, ButtonModule, TagModule, TabsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class AppointmentsPage {
  private readonly portal = inject(PortalService);
  private readonly messages = inject(MessageService);

  protected readonly all = this.portal.appointments;
  protected readonly upcoming = this.portal.upcomingAppointments;

  protected readonly past = computed(() =>
    this.all().filter((a) => a.status !== 'SCHEDULED'),
  );

  /** The month the calendar is showing. */
  protected readonly cursor = signal(new Date(2026, 6, 1));

  protected readonly monthLabel = computed(() =>
    this.cursor().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
  );

  protected readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  /** A Monday-first month grid, with appointments bucketed onto their day. */
  protected readonly calendar = computed<CalendarCell[]>(() => {
    const cursor = this.cursor();
    const year = cursor.getFullYear();
    const month = cursor.getMonth();

    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // JS weeks start on Sunday; shift so Monday is column one.
    const leading = (first.getDay() + 6) % 7;

    const cells: CalendarCell[] = [];
    const today = new Date();

    for (let i = 0; i < leading; i++) {
      cells.push({ date: null, inMonth: false, isToday: false, appointments: [] });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const iso = this.isoDate(date);

      cells.push({
        date,
        inMonth: true,
        isToday: this.isoDate(today) === iso,
        appointments: this.all().filter((a) => a.date === iso),
      });
    }

    return cells;
  });

  protected shiftMonth(delta: number): void {
    const current = this.cursor();
    this.cursor.set(new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  protected kindLabel(kind: AppointmentKind): string {
    return { INSPECTION: 'Inspection', MEETING: 'Meeting', OFFICER_VISIT: 'Officer visit' }[kind];
  }

  protected kindIcon(kind: AppointmentKind): string {
    return {
      INSPECTION: 'pi pi-search',
      MEETING: 'pi pi-users',
      OFFICER_VISIT: 'pi pi-map-marker',
    }[kind];
  }

  protected kindTint(kind: AppointmentKind): string {
    return { INSPECTION: 'tint-gold', MEETING: 'tint-blue', OFFICER_VISIT: 'tint-green' }[kind];
  }

  protected statusSeverity(status: Appointment['status']): Severity {
    const map: Record<Appointment['status'], Severity> = {
      SCHEDULED: 'warn',
      COMPLETED: 'success',
      CANCELLED: 'secondary',
    };
    return map[status];
  }

  protected addToCalendar(appointment: Appointment): void {
    this.messages.add({
      severity: 'info',
      summary: 'Demonstration build',
      detail: `In the live portal this adds “${appointment.title}” to your calendar.`,
      life: 4000,
    });
  }

  private isoDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`;
  }
}
