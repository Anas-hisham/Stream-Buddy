import BracketView from '../../features/brackets/Brackets.vue'
import PlayersStatsView from '../../features/players-stats/PlayersStats.vue'
import TodaysMatchesView from '../../features/todays-matches/TodaysMatches.vue'
import SettingsView from '../../features/settings/Settings.vue'
import WelcomeView from '../../pages/Welcome.vue'
import AppOverView from '../../pages/AppOverView.vue'
import ViewBuilder from '../../features/view-builder/ViewBuilder.vue'
import CustomView from '../../features/custom-view/CustomView.vue'
import { PATHS } from '../../shared/constants/paths'
import { TITLES } from '../../shared/constants/titles'

const routes = [
    {
        path: '/',
        redirect: PATHS.WELCOME
    },
    {
        path: PATHS.WELCOME,
        component: WelcomeView,
        meta: { title: TITLES.WELCOME }
    },
    {
        path: PATHS.OVER_VIEW,
        component: AppOverView,
        meta: { title: TITLES.OVER_VIEW }
    },
    {
        path: PATHS.TEAMS,
        component: BracketView,
        meta: { title: TITLES.TEAMS }
    },
    {
        path: PATHS.PLAYERS,
        component: PlayersStatsView,
        meta: { title: TITLES.PLAYERS }
    },
    {
        path: PATHS.TEAMS,
        component: TodaysMatchesView,
        meta: { title: TITLES.MATCHES }
    },
    {
        path: PATHS.SETTINGS,
        component: SettingsView,
        meta: { title: TITLES.SETTINGS }
    },
    {
        path: PATHS.VIEW_BUILDER,
        component: ViewBuilder,
        meta: { title: TITLES.VIEW_BUILDER }
    },
    {
        path: '/:customView',
        component: CustomView,
        meta: {
            title: TITLES.CUSTOM_VIEW,
            isCustomView: true
        }
    }
]
export default routes
