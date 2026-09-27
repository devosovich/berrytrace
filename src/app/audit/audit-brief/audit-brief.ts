import { Component, computed, signal } from '@angular/core';

/** Topics a brief can ask the auditor to check; the same list as the "What can be included" cards. */
export type AuditCheck = 'capacity' | 'cold' | 'docs' | 'trace' | 'lab' | 'media';

/**
 * Sample audit brief in the hero: a preview of the brief form on the platform. Visitors can toggle
 * the checks to see how it works; nothing is submitted.
 */
@Component({
  selector: 'app-audit-brief',
  templateUrl: './audit-brief.html',
  styleUrl: './audit-brief.css',
})
export class AuditBrief {
  protected readonly checks: { id: AuditCheck; label: string }[] = [
    { id: 'capacity', label: $localize`:@@audit.brief.check.capacity:Потужності` },
    { id: 'cold', label: $localize`:@@audit.brief.check.cold:Холодний ланцюг` },
    { id: 'docs', label: $localize`:@@audit.brief.check.docs:Документи` },
    { id: 'trace', label: $localize`:@@audit.brief.check.trace:Простежуваність` },
    { id: 'lab', label: $localize`:@@audit.brief.check.lab:Відбір проб` },
    { id: 'media', label: $localize`:@@audit.brief.check.media:Фото / відео` },
  ];

  /** Pre-selected as in the design. */
  protected readonly selected = signal<ReadonlySet<AuditCheck>>(new Set(['capacity', 'cold', 'trace', 'lab']));
  protected readonly selectedCount = computed(() => this.selected().size);

  protected toggle(id: AuditCheck): void {
    this.selected.update((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }
}
