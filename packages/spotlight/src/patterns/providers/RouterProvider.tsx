import { HashRouter, Switch } from "react-router-dom";
import { Route } from "../../components/Route";
import { MainView } from "../../views/MainView";

export const MainRouterProvider: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" component={MainView} />
      </Switch>
    </HashRouter>
  );
};
