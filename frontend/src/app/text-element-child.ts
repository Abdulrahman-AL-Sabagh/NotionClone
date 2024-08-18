export interface TextElementChild {
  startsAt: number;
  endsAt: number;
  style: Set<'italic' | 'bold' | 'line-through'>;
}
