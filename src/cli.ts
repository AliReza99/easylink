#!/usr/bin/env node
import prompts from 'prompts';
import { linkGlobalLinkToLocal } from './linkGlobalLinkToLocal';
import { showAvailableGlobalLinks, showAvailableLocalLinks } from './showAvailableLinks';
import { createGlobalLinkForCurrentProject, removeGlobalLinks } from './createLink';

async function main() {
  let keepAsking = true;

  while (keepAsking) {
    const response = await prompts({
      type: 'select',
      name: 'link',
      message: 'Select an action',
      choices: [
        {
          title: '1- View Global Links',
          value: '1',
        },
        {
          title: '2- View Local Links',
          value: '2',
        },
        {
          title: '3- Link Global Links to this project',
          value: '3',
        },
        {
          title: '4- Create Global Link from this project',
          value: '4',
        },
        {
          title: '5- Remove Global Links',
          value: '5',
        },
        //
        { title: 'Exit', value: 'cancel' },
      ],
    });

    if (!response.link || response.link === 'cancel') {
      keepAsking = false;
      return;
    }

    if (response.link === '1') {
      await showAvailableGlobalLinks();
    }
    if (response.link === '2') {
      await showAvailableLocalLinks();
    }
    if (response.link === '3') {
      await linkGlobalLinkToLocal();
    }
    if (response.link === '4') {
      await createGlobalLinkForCurrentProject();
    }
    if (response.link === '5') {
      await removeGlobalLinks();
    }
    console.log('\n');
  }
}

main();
