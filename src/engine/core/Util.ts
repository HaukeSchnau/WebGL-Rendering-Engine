const SECOND = 1e3;

export function getTime(): number {
  return new Date().getTime() / SECOND;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function removeEmptyStrings(data: string[]) {
  const result: string[] = [];

  for (let line of data) {
    if (line.length) result.push(line);
  }

  return result;
}
