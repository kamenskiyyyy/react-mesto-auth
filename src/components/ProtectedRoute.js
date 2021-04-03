import {Route, Redirect} from 'react-router-dom';
import {AppContext} from "../contexts/AppContext";
import {useContext} from "react";

function ProtectedRoute({component: Component, ...props}) {
  const value = useContext(AppContext);
  return (
    <Route>
      {value.loggedIn ? <Component {...props} /> : <Redirect to="/sign-in"/>}
    </Route>
  )
}

export default ProtectedRoute;