import logSymbols from 'log-symbols';
import { getGlobalLinks, npmLinkCurrent, npmUnlink } from './utils';
import prompts from 'prompts';

export async function createGlobalLinkForCurrentProject() {
  return npmLinkCurrent();
}

export async function removeGlobalLinks() {
  let keepAsking = true;

  while (keepAsking) {
    const globalLinks = await getGlobalLinks();

    if (globalLinks.length === 0) {
      console.log(`${logSymbols.error} No Global links found`);
      keepAsking = false;
      return;
    }

    const options = [
      ...globalLinks.map(({ name, version }) => {
        return {
          title: name,
          version: version,
          value: name,
        };
      }),
    ];

    const response = await prompts({
      type: 'select',
      name: 'link',
      message: 'Select Link to remove',
      choices: [...options, { title: 'Exit', value: 'cancel' }],
    });

    if (!response.link) {
      keepAsking = false;
      process.exit(0);
    }

    if (response.link === 'cancel') {
      keepAsking = false;
      return;
    }

    await npmUnlink(response.link, { global: true });
    console.log(`\n`);
  }
}
