import { PageGroup } from '../interface/pagination.interface';

export class AddressBookPaginationConfig {
  private static readonly PAGE_GROUPS: PageGroup[] = [
    { start: 'A', end: 'B', characters: ['A', 'B'] },
    { start: 'C', end: 'D', characters: ['C', 'D'] },
    { start: 'E', end: 'F', characters: ['C', 'D'] },
    { start: 'G', end: 'H', characters: ['C', 'D'] },
    { start: 'I', end: 'J', characters: ['C', 'D'] },
    { start: 'K', end: 'L', characters: ['C', 'D'] },
    { start: 'M', end: 'N', characters: ['C', 'D'] },
    { start: 'O', end: 'P', characters: ['C', 'D'] },
    { start: 'Q', end: 'R', characters: ['C', 'D'] },
    { start: 'S', end: 'T', characters: ['C', 'D'] },
    { start: 'U', end: 'V', characters: ['C', 'D'] },
    { start: 'W', end: 'X', characters: ['C', 'D'] },
    { start: 'Y', end: 'Z', characters: ['C', 'D'] },
  ];

  static getPageGroups(): PageGroup[] {
    return this.PAGE_GROUPS;
  }

  static getPageByCursor(cursor: string): PageGroup | null {
    return this.PAGE_GROUPS[Number(cursor)] || null;
  }
}
