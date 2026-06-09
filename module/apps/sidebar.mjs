/**
 * Unknown Armies 3E Sidebar Enhancements
 * Adds custom tabs and buttons to the Foundry UI
 */

export function registerSidebarHooks() {

  /**
   * Add custom buttons to Actor Directory
   */
  Hooks.on('renderActorDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    // Add Create Character button
    const createCharacterBtn = $(`
      <button class="create-entity create-character" data-type="character">
        <i class="fas fa-user"></i> ${game.i18n.localize('UA3E.CreateCharacter')}
      </button>
    `);

    // Add Create NPC button  
    const createNPCBtn = $(`
      <button class="create-entity create-npc" data-type="npc">
        <i class="fas fa-skull"></i> ${game.i18n.localize('UA3E.CreateNPC')}
      </button>
    `);

    header.find('.create-document').after(createCharacterBtn, createNPCBtn);

    // Click handlers
    createCharacterBtn.click(() => {
      createActor('character');
    });

    createNPCBtn.click(() => {
      createActor('npc');
    });
  });

  /**
   * Add custom buttons to Item Directory
   */
  Hooks.on('renderItemDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    const createIdentityBtn = $(`
      <button class="create-entity create-identity" data-type="identity">
        <i class="fas fa-id-card"></i> ${game.i18n.localize('UA3E.CreateIdentity')}
      </button>
    `);

    const createEquipmentBtn = $(`
      <button class="create-entity create-equipment" data-type="equipment">
        <i class="fas fa-toolbox"></i> ${game.i18n.localize('UA3E.CreateEquipment')}
      </button>
    `);

    header.find('.create-document').after(createIdentityBtn, createEquipmentBtn);

    createIdentityBtn.click(() => {
      createItem('identity');
    });

    createEquipmentBtn.click(() => {
      createItem('equipment');
    });
  });

  /**
   * Add custom buttons to Scene Directory
   */
  Hooks.on('renderSceneDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    const createSceneBtn = $(`
      <button class="create-entity create-scene">
        <i class="fas fa-map"></i> ${game.i18n.localize('UA3E.CreateScene')}
      </button>
    `);

    header.find('.create-document').after(createSceneBtn);

    createSceneBtn.click(() => {
      createScene();
    });
  });

  /**
   * Add custom buttons to Journal Directory
   */
  Hooks.on('renderJournalDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    const createJournalBtn = $(`
      <button class="create-entity create-journal">
        <i class="fas fa-book-open"></i> ${game.i18n.localize('UA3E.CreateJournal')}
      </button>
    `);

    header.find('.create-document').after(createJournalBtn);

    createJournalBtn.click(() => {
      createJournal();
    });
  });

  /**
   * Add custom buttons to RollTable Directory
   */
  Hooks.on('renderRollTableDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    const createTableBtn = $(`
      <button class="create-entity create-table">
        <i class="fas fa-dice"></i> ${game.i18n.localize('UA3E.CreateRollTable')}
      </button>
    `);

    header.find('.create-document').after(createTableBtn);

    createTableBtn.click(() => {
      createRollTable();
    });
  });

  /**
   * Add custom buttons to Cards Directory
   */
  Hooks.on('renderCardsDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    const createCardsBtn = $(`
      <button class="create-entity create-cards">
        <i class="fas fa-cards-blank"></i> ${game.i18n.localize('UA3E.CreateCards')}
      </button>
    `);

    header.find('.create-document').after(createCardsBtn);

    createCardsBtn.click(() => {
      createCards();
    });
  });

  /**
   * Add custom buttons to Playlist Directory
   */
  Hooks.on('renderPlaylistDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    const createPlaylistBtn = $(`
      <button class="create-entity create-playlist">
        <i class="fas fa-music"></i> ${game.i18n.localize('UA3E.CreatePlaylist')}
      </button>
    `);

    header.find('.create-document').after(createPlaylistBtn);

    createPlaylistBtn.click(() => {
      createPlaylist();
    });
  });

  /**
   * Add custom buttons to Compendium Directory
   */
  Hooks.on('renderCompendiumDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    const createCompendiumBtn = $(`
      <button class="create-entity create-compendium">
        <i class="fas fa-atlas"></i> ${game.i18n.localize('UA3E.CreateCompendium')}
      </button>
    `);

    header.find('.create-compendium').after(createCompendiumBtn);

    createCompendiumBtn.click(() => {
      createCompendium();
    });
  });

  /**
   * Add custom buttons to Macro Directory
   */
  Hooks.on('renderMacroDirectory', (app, html, data) => {
    const header = html.find('.directory-header');

    const createMacroBtn = $(`
      <button class="create-entity create-macro">
        <i class="fas fa-terminal"></i> ${game.i18n.localize('UA3E.CreateMacro')}
      </button>
    `);

    header.find('.create-document').after(createMacroBtn);

    createMacroBtn.click(() => {
      createMacro();
    });
  });
}

/**
 * Create a new Actor with UA3E system
 * @param {string} type - 'character' or 'npc'
 */
async function createActor(type) {
  const actorData = {
    name: game.i18n.format('UA3E.NewActor', { type: game.i18n.localize(`UA3E.${type.charAt(0).toUpperCase() + type.slice(1)}`) }),
    type: type,
    system: {}
  };

  const actor = await Actor.create(actorData);
  actor.sheet.render(true);
}

/**
 * Create a new Item with UA3E system
 * @param {string} type - item type
 */
async function createItem(type) {
  const itemData = {
    name: game.i18n.format('UA3E.NewItem', { type: game.i18n.localize(`UA3E.Item${type.charAt(0).toUpperCase() + type.slice(1)}`) }),
    type: type,
    system: {}
  };

  const item = await Item.create(itemData);
  item.sheet.render(true);
}

/**
 * Create a new Scene
 */
async function createScene() {
  const sceneData = {
    name: game.i18n.localize('UA3E.NewScene'),
    width: 3000,
    height: 2000,
    grid: {
      type: 1,
      size: 100,
      color: '#000000',
      alpha: 0.2
    }
  };

  const scene = await Scene.create(sceneData);
  scene.sheet.render(true);
}

/**
 * Create a new Journal Entry
 */
async function createJournal() {
  const journalData = {
    name: game.i18n.localize('UA3E.NewJournal'),
    pages: [{
      name: game.i18n.localize('UA3E.NewPage'),
      type: 'text',
      text: { content: '' }
    }]
  };

  const journal = await JournalEntry.create(journalData);
  journal.sheet.render(true);
}

/**
 * Create a new RollTable
 */
async function createRollTable() {
  const tableData = {
    name: game.i18n.localize('UA3E.NewRollTable'),
    formula: '1d6',
    results: []
  };

  const table = await RollTable.create(tableData);
  table.sheet.render(true);
}

/**
 * Create a new Cards stack
 */
async function createCards() {
  const cardsData = {
    name: game.i18n.localize('UA3E.NewCards'),
    type: 'deck'
  };

  const cards = await Cards.create(cardsData);
  cards.sheet.render(true);
}

/**
 * Create a new Playlist
 */
async function createPlaylist() {
  const playlistData = {
    name: game.i18n.localize('UA3E.NewPlaylist'),
    mode: 'sequential',
    sounds: []
  };

  const playlist = await Playlist.create(playlistData);
  playlist.sheet.render(true);
}

/**
 * Create a new Compendium
 */
async function createCompendium() {
  const types = ['Actor', 'Item', 'Scene', 'JournalEntry', 'RollTable', 'Macro', 'Cards'];

  const content = await renderTemplate('systems/unknown-armies-3e/templates/apps/create-compendium.html', { types });

  new Dialog({
    title: game.i18n.localize('UA3E.CreateCompendium'),
    content: content,
    buttons: {
      create: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('UA3E.Create'),
        callback: async (html) => {
          const name = html.find('[name="name"]').val();
          const type = html.find('[name="type"]').val();
          const label = html.find('[name="label"]').val();

          if (!name) return;

          await CompendiumCollection.createCompendium({
            type: type,
            label: label || name,
            name: name.slugify(),
            system: 'unknown-armies-3e'
          });
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('UA3E.Cancel')
      }
    }
  }).render(true);
}

/**
 * Create a new Macro
 */
async function createMacro() {
  const macroData = {
    name: game.i18n.localize('UA3E.NewMacro'),
    type: 'script',
    command: ''
  };

  const macro = await Macro.create(macroData);
  macro.sheet.render(true);
}