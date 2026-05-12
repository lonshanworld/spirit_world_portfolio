import { ElementType } from '../interfaces/spirit.interface';

export class SpiritInteractDto {
  spiritId: ElementType;
  interactionType: string;
  section?: string;
}

export class SectionVisibleDto {
  section: string;
}

export class ThemeChangeRequestDto {
  elementId: ElementType;
  combinedWithId?: ElementType;
}
