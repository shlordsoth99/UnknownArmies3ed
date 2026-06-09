/**
 * Unknown Armies 3rd Edition System for Foundry VTT
 * Based on the work of patrickbuck1988 and the UA community
 */

import { UA3E } from './config.mjs';
import { registerSystemSettings } from './settings.mjs';
import { UA3EActor } from './actors/actor.mjs';
import { UA3EItem } from './items/item.mjs';
import { UA3EActorSheet } from './actors/sheet.mjs';
import { UA3ENPCSheet } from './actors/npc-sheet.mjs';
import { UA3EItemSheet } from './items/sheet.mjs';
import { StressRoll, PercentileRoll } from './dice/dice.mjs';
import { preloadHandlebarsTemplates } from './apps/templates.mjs';
import { registerHandlebarsHelpers } from './apps/helpers.mjs';

/* -------------------------------------------- */
/*  System Initialization                         */
/* -------------------------------------------- */

Hooks.once('init', async function() {
  console.log('Unknown Armies 3E | Initializing system...');

  // Add UA3E namespace to global game object
  game.ua3e = {
    config: UA3E,
    dice: { StressRoll, PercentileRoll }
  };

  // Register System Settings
  registerSystemSettings();

  // Define custom Document classes
  CONFIG.Actor.documentClass = UA3EActor;
  CONFIG.Item.documentClass = UA3EItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('unknown-armies-3e', UA3EActorSheet, {
    types: ['character'],
    makeDefault: true,
    label: 'UA3E.SheetCharacter'
  });
  Actors.registerSheet('unknown-armies-3e', UA3ENPCSheet, {
    types: ['npc'],
    makeDefault: true,
    label: 'UA3E.SheetNPC'
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('unknown-armies-3e', UA3EItemSheet, {
    makeDefault: true,
    label: 'UA3E.SheetItem'
  });

  // Register Handlebars helpers
  registerHandlebarsHelpers();

  // Preload templates
  await preloadHandlebarsTemplates();

  console.log('Unknown Armies 3E | System initialized successfully');
});

/* -------------------------------------------- */
/*  Ready Hook                                    */
/* -------------------------------------------- */

Hooks.once('ready', async function() {
  console.log('Unknown Armies 3E | Ready');

  // Apply stress automation if enabled
  if (game.settings.get('unknown-armies-3e', 'autoStress')) {
    console.log('Unknown Armies 3E | Automatic stress tracking enabled');
  }
});

/* -------------------------------------------- */
/*  Chat Message Hooks                            */
/* -------------------------------------------- */

Hooks.on('renderChatMessage', (app, html, data) => {
  // Add click handlers for stress roll results
  html.find('.ua3e-stress-result').click(async (event) => {
    const actorId = event.currentTarget.dataset.actorId;
    const gauge = event.currentTarget.dataset.gauge;
    const actor = game.actors.get(actorId);
    if (actor && actor.isOwner) {
      await actor.applyStressResult(gauge, event.currentTarget.dataset.result);
    }
  });
});

/* -------------------------------------------- */
/*  Combat Hooks                                  */
/* -------------------------------------------- */

Hooks.on('getSceneControlButtons', (controls) => {
  // Add UA3E-specific controls
  const tokenTools = controls.find(c => c.name === 'token');
  if (tokenTools) {
    tokenTools.tools.push({
      name: 'stress-check',
      title: 'UA3E.StressCheck',
      icon: 'fas fa-brain',
      visible: game.user.isGM,
      onClick: () => {
        // Open stress check dialog
        new Dialog({
          title: game.i18n.localize('UA3E.StressCheck'),
          content: '<p>Select gauge and target...</p>',
          buttons: {}
        }).render(true);
      }
    });
  }
});

/* -------------------------------------------- */
/*  Utility Functions                             */
/* -------------------------------------------- */

/**
 * Helper to get the current roll mode
 */
export function getRollMode() {
  return game.settings.get('core', 'rollMode');
}

/**
 * Helper to create a percentile roll
 * @param {string} formula - The roll formula (e.g., "d%")
 * @param {Object} data - Roll data
 * @param {Object} options - Roll options
 * @returns {Promise<PercentileRoll>}
 */
export async function rollPercentile(formula, data = {}, options = {}) {
  const roll = new PercentileRoll(formula, data, options);
  await roll.evaluate();
  return roll;
}

/**
 * Helper to create a stress check roll
 * @param {string} gauge - The stress gauge (violence, helplessness, unnatural, isolation, self)
 * @param {number} hardened - Number of hardened notches
 * @param {Object} options - Roll options
 * @returns {Promise<StressRoll>}
 */
export async function rollStress(gauge, hardened = 0, options = {}) {
  const roll = new StressRoll(gauge, hardened, options);
  await roll.evaluate();
  return roll;
}