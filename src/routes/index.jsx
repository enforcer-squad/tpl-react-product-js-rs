import { useRoutes, BrowserRouter } from 'react-router-dom';
import { useModel, useWatch } from '@enforcer-squad/rex';
import userModel from '@/store/user';
import routes from './config';
import {useSuspense} from '@/utils/useSuspense'

const Routes = ({ role }) => {
  const routing = useRoutes(routes(role));
  return routing;
};

const Router = () => {
  const { role, check } = useModel(userModel);

  useSuspense(check, { cacheKeys: ['check'] });

  return (
    <BrowserRouter>
      <Routes role={role} />
    </BrowserRouter>
  );
};
export default Router;
