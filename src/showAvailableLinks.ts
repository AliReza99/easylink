import logSymbols from 'log-symbols';
import { getGlobalLinks, getLocalLinks } from './utils';

export async function showAvailableGlobalLinks() {
  const globalLinks = await getGlobalLinks();

  if (globalLinks.length === 0) {
    console.log(`${logSymbols.error} No Global links found`);
    return;
  }

  for (const l of globalLinks) {
    console.log(l.name);
  }
}

export async function showAvailableLocalLinks() {
  const localLinks = await getLocalLinks();

  if (localLinks.length === 0) {
    console.log(`${logSymbols.error} No Local links found`);
    return;
  }

  for (const l of localLinks) {
    console.log(l.name);
  }
}
