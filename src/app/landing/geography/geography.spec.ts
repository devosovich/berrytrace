import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LOCALE } from '@analogjs/router/tokens';

import { Geography } from './geography';

describe('Geography', () => {
  let fixture: ComponentFixture<Geography>;
  let element: HTMLElement;

  const chips = () => [...element.querySelectorAll<HTMLButtonElement>('.region')];
  const detail = () => element.querySelector('.region-detail')!.textContent!.replace(/\s+/g, ' ').trim();
  const partnerShape = (name: string) =>
    [...element.querySelectorAll<SVGPathElement>('.shape--partner')].find((el) =>
      el.getAttribute('aria-label')!.startsWith(name),
    )!;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Geography],
      providers: [provideRouter([]), { provide: LOCALE, useValue: 'uk' }],
    });
    fixture = TestBed.createComponent(Geography);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('derives the stats from the region data', () => {
    const values = [...element.querySelectorAll('.stat-value')].map((el) => el.textContent!.trim());
    expect(values).toEqual(['5+', '10+', '3+']);
  });

  it('lists the five partner regions, most producers first, and selects the first', () => {
    // The count sits in its own badge, so the text content has no space between name and number.
    expect(chips().map((chip) => chip.textContent!.replace(/\s+/g, ' ').trim())).toEqual([
      'Вінницька3',
      'Хмельницька2',
      'Тернопільська2',
      'Закарпатська2',
      'Львівська1',
    ]);
    expect(chips()[0].getAttribute('aria-pressed')).toBe('true');
    expect(detail()).toContain('Вінницька');
    expect(detail()).toContain('3 виробники');
  });

  it('selects a region from the list', () => {
    chips()[4].click();
    fixture.detectChanges();

    expect(chips()[4].getAttribute('aria-pressed')).toBe('true');
    expect(partnerShape('Львівська').getAttribute('aria-pressed')).toBe('true');
    expect(detail()).toContain('1 виробник');
  });

  it('previews a region on hover without changing the selection', () => {
    partnerShape('Тернопільська').dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(detail()).toContain('Тернопільська');
    expect(chips()[0].getAttribute('aria-pressed')).toBe('true');

    partnerShape('Тернопільська').dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(detail()).toContain('Вінницька');
  });

  it('selects a region with the keyboard', () => {
    partnerShape('Закарпатська').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(chips()[3].getAttribute('aria-pressed')).toBe('true');
  });

  it('makes only regions with producers selectable', () => {
    expect(element.querySelectorAll('.shape--partner')).toHaveLength(5);
    expect(element.querySelectorAll('.shape')).toHaveLength(25);
  });

  // Angular creates SVG elements client-side with the tag name exactly as written, and a filter
  // without valid primitives (e.g. a lowercase `fedropshadow`) makes everything using it invisible.
  // Prerendered HTML hides this because the browser's HTML parser fixes the case.
  it('uses correctly cased filter primitives', () => {
    const primitives = [...element.querySelectorAll('filter > *')].map((el) => el.tagName);
    expect(primitives).toEqual(['feDropShadow', 'feDropShadow', 'feDropShadow']);
  });
});
