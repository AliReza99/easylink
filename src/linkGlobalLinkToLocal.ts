import logSymbols from "log-symbols";
import { getGlobalLinks, getLocalLinks, npmLink, npmUnlink } from "./utils";
import prompts from "prompts";

export async function linkGlobalLinkToLocal() {
  let keepAsking = true;
  let selectedItemIndex = 0;

  const globalLinks = await getGlobalLinks();

  if (globalLinks.length === 0) {
    console.log(`${logSymbols.error} No Global links found`);
    return;
  }

  const value: Record<string, boolean> = {};

  while (keepAsking) {
    const localLinks = await getLocalLinks();

    for (const l of globalLinks) {
      value[l.name] = Boolean(localLinks.find(el => el.name === l.name));
    }

    const options = [
      ...globalLinks
        .map(({ name, version }) => {
          return {
            title: name,
            version: version,
            value: name,
          };
        })
        .map(el => {
          const isSelected = value[el.value] ?? false;

          return {
            title: isSelected ? `[${logSymbols.success}] ${el.title}` : `[ ] ${el.title}`,
            version: el.version,
            value: el.value,
          };
        }),
    ];

    const response = await prompts({
      type: 'select',
      name: 'link',
      message: 'Available Global Links',
      initial: selectedItemIndex, // Set the initial selected index
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

    selectedItemIndex = options.findIndex(el => el.value === response.link);
    const selectedOption = options[selectedItemIndex];

    const shouldLink = !value[response.link];

    if (shouldLink) {
      await npmLink(selectedOption.value);
    } else {
      await npmUnlink(selectedOption.value);
    }
    console.log(`\n`);
  }
}
