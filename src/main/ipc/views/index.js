import { setupTeamsHandlers } from './teamsHandlers.js'
import { setupPlayersHandlers } from './players.js'
import { setupMatchesHandlers } from './matches.js'
import { setupCustomViewHandlers } from './customView.js';
import { setupViewBuilderHandlers } from './viewBuilder.js';

function setupDataHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal) {

    setupMatchesHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)

    setupPlayersHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)

    setupCustomViewHandlers(store, getCustomSavePathGlobal);

    setupViewBuilderHandlers(store);

    setupTeamsHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)

}

export { setupDataHandlers }
