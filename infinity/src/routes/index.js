import PATHS from '../config/path';
import Userprofile from '../pages/ProfileDetails';
import Login from '../pages/Login'
import Signup from '../pages/Signup'

const routes = [
  { exact: true, path: PATHS.USER, component: Userprofile },
  { exact: true, path: PATHS.LOGIN, component: Login },
  { exact: true, path: PATHS.SIGNUP, component: Signup },
];

export default routes;