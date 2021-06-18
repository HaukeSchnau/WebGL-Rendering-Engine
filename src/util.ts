export function getTime(): number {
  return new Date().getTime();
}

export function removeEmptyStrings(data: string[]) {
  const result: string[] = [];

  for (let line of data) {
    if (line.length) result.push(line);
  }

  return result;
}
