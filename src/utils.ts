import readline from 'readline';
import { execute } from '@arbz/execute';

export function clearLines(lines: number) {
  for (let i = 0; i < lines; i++) {
    readline.moveCursor(process.stdout, 0, -1); // Move the cursor up by one line
    readline.clearLine(process.stdout, 0); // Clear the line
  }
  readline.cursorTo(process.stdout, 0); // Move cursor to the start of the line
}

type NpmLinkResult = {
  name: string;
  dependencies: null | Record<string, { version: string; resolved: string; overridden: boolean }>;
};

function reshapeLinks(res: NpmLinkResult) {
  const links = Object.entries(res.dependencies ?? {}).map(([linkName, { version }]) => {
    return {
      name: linkName,
      version: version,
    };
  });

  return links;
}

export function npmLinkCurrent() {
  return execute(`npm link`);
}

export function npmLink(packageName: string) {
  return execute(`npm link ${packageName}`, { disableStdOut: true });
}

export function npmUnlink(packageName: string, { global = false }: { global: boolean } = { global: false }) {
  return execute(`npm unlink ${global ? '-g' : ''} ${packageName}`, { disableStdOut: true });
}

export async function getGlobalLinks() {
  const availableGlobalLinksOut = await execute(`npm ls --link -g --json`, { disableStdOut: true });
  const availableGlobalLinks = JSON.parse(availableGlobalLinksOut) as NpmLinkResult;
  const globalLinks = reshapeLinks(availableGlobalLinks);

  return globalLinks;
}

export async function getLocalLinks() {
  const availableLocalLinksOut = await execute(`npm ls --link --json`, { disableStdOut: true });
  const availableLocalLinks = JSON.parse(availableLocalLinksOut) as NpmLinkResult;
  const localLinks = reshapeLinks(availableLocalLinks);
  return localLinks;
}
