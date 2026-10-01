import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../../i18n';
import { REGION_SHAPES, RegionShape } from './regions';

interface Region extends RegionShape {
  readonly name: string;
  /** Label split over two lines (long hyphenated names such as Ivano-Frankivsk). */
  readonly lines: readonly string[];
  /** Verified producers in the region; 0 for regions we do not work in yet. */
  readonly producers: number;
  /** Screen-reader label of a selectable region. */
  readonly ariaLabel: string;
}

/** Verified producers per region, in the order the region chips are shown. */
const PRODUCERS: Record<string, number> = {
  vinnytsia: 3,
  khmelnytskyi: 2,
  ternopil: 2,
  zakarpattia: 2,
  lviv: 1,
};

const NAMES: Record<string, string> = {
  cherkasy: $localize`:@@geography.mapCol1:Черкаська`,
  chernihiv: $localize`:@@geography.mapCol2:Чернігівська`,
  chernivtsi: $localize`:@@geography.mapCol3:Чернівецька`,
  crimea: $localize`:@@geography.mapCol4:АР Крим`,
  dnipro: $localize`:@@geography.mapCol5:Дніпропетровська`,
  donetsk: $localize`:@@geography.mapCol6:Донецька`,
  'ivano-frankivsk': $localize`:@@geography.mapCol7:Івано-Франківська`,
  kharkiv: $localize`:@@geography.mapCol8:Харківська`,
  kherson: $localize`:@@geography.mapCol9:Херсонська`,
  khmelnytskyi: $localize`:@@geography.mapCol10:Хмельницька`,
  kyiv: $localize`:@@geography.mapCol11:Київська`,
  kirovohrad: $localize`:@@geography.mapCol12:Кіровоградська`,
  luhansk: $localize`:@@geography.mapCol13:Луганська`,
  lviv: $localize`:@@geography.mapCol14:Львівська`,
  mykolaiv: $localize`:@@geography.mapCol15:Миколаївська`,
  odesa: $localize`:@@geography.mapCol16:Одеська`,
  poltava: $localize`:@@geography.mapCol17:Полтавська`,
  rivne: $localize`:@@geography.mapCol18:Рівненська`,
  sumy: $localize`:@@geography.mapCol19:Сумська`,
  ternopil: $localize`:@@geography.mapCol20:Тернопільська`,
  vinnytsia: $localize`:@@geography.mapCol21:Вінницька`,
  volyn: $localize`:@@geography.mapCol23:Волинська`,
  zakarpattia: $localize`:@@geography.mapCol24:Закарпатська`,
  zaporizhzhia: $localize`:@@geography.mapCol25:Запорізька`,
  zhytomyr: $localize`:@@geography.mapCol26:Житомирська`,
};

const REGIONS: readonly Region[] = REGION_SHAPES.map((shape) => {
  const name = NAMES[shape.id];
  const producers = PRODUCERS[shape.id] ?? 0;
  const hyphen = name.indexOf('-');
  return {
    ...shape,
    name,
    lines: hyphen > 0 ? [name.slice(0, hyphen + 1), name.slice(hyphen + 1)] : [name],
    producers,
    ariaLabel: $localize`:@@geography.regionLabel:${name}:REGION: — виробників: ${producers}:COUNT:`,
  };
});

/** Berry types we supply; not tied to a region, so it is not derived from the map data. */
const BERRY_TYPES = 3;

/**
 * Interactive map of Ukraine. Regions with verified producers can be hovered, focused and selected on
 * the map or in the list; hovering previews a region, clicking (or Enter/Space) selects it.
 */
@Component({
  selector: 'app-geography',
  imports: [RouterLink],
  templateUrl: './geography.html',
  styleUrl: './geography.css',
})
export class Geography {
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');

  protected readonly regions = REGIONS;
  /** Regions we work in, most producers first. */
  protected readonly partners = REGIONS.filter((r) => r.producers > 0).sort((a, b) => b.producers - a.producers);

  protected readonly regionCount = this.partners.length;
  protected readonly producerCount = this.partners.reduce((sum, r) => sum + r.producers, 0);
  protected readonly berryTypes = BERRY_TYPES;

  private readonly selectedId = signal(this.partners[0].id);
  private readonly previewId = signal<string | null>(null);

  /** The region shown highlighted with its tooltip: the one being previewed, else the selected one. */
  protected readonly active = computed(
    () => REGIONS.find((r) => r.id === (this.previewId() ?? this.selectedId()))!,
  );
  /** The selected region, for the chip highlight (a hover preview does not change it). */
  protected readonly selected = computed(() => REGIONS.find((r) => r.id === this.selectedId())!);

  protected readonly tooltipWidth = 152;

  protected select(region: Region): void {
    this.selectedId.set(region.id);
    this.previewId.set(null);
  }

  protected preview(region: Region | null): void {
    this.previewId.set(region?.id ?? null);
  }
}
