import { setupTeamsHandlers } from './teamsHandlers.js'
import { setupPlayersHandlers } from './playersHandlers.js'
import { setupMatchesHandlers } from './matchesHandlers.js'
import { setupCustomViewHandlers } from './setupCustomViewHandlers.js';
import { setupViewBuilderHandlers } from './setupViewBuilderHandlers.js';

function setupDataHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal) {

    setupMatchesHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)

    setupPlayersHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)

    setupCustomViewHandlers(store, getCustomSavePathGlobal);

    setupViewBuilderHandlers(store);

    setupTeamsHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)

}

export { setupDataHandlers }
