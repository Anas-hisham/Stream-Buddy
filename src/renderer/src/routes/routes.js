import BracketView from '../views/Brackets.vue'
import PlayersStatsView from '../views/PlayersStats.vue'
import TodaysMatchesView from '../views/TodaysMatches.vue'
import SettingsView from '../views/Settings.vue'
import WelcomeView from '../views/Welcome.vue'
import ViewBuilder from '../views/ViewBuilder.vue';
import CustomView from '../views/CustomView.vue'

const routes = [
    {
        path: '/',
        redirect: '/welcome'
    },
    {
        path: '/welcome',
        component: WelcomeView,
        meta: { title: 'Welcome' }
    },
    {
        path: '/brackets',
        component: BracketView,
        meta: { title: 'Brackets View' }
    },
    {
        path: '/players',
        component: PlayersStatsView,
        meta: { title: 'Players Stats' }
    },
    {
        path: "/matches",
        component: TodaysMatchesView,
        meta: { title: "Today's Matches" }
    },
    {
        path: '/settings',
        component: SettingsView,
        meta: { title: 'Settings' }
    }, {
        path: '/view-builder',
        component: ViewBuilder,
        meta: { title: 'View Builder' }
    },
    {
        path: '/:customView',
        component: CustomView,
        meta: {
            title: 'Custom View',
            isCustomView: true,
        }
    }
]
export default routes
