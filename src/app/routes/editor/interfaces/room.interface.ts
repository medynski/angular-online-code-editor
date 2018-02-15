export interface Room {
  readonly id: string;
  readonly name: string;
  readonly content: string;
  readonly creation_timestamp: number;
  readonly last_modified: number;
}
