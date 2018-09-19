import React from "react"
import {
  HashRouter as Router,
  Route,
} from "react-router-dom";

export default class AppRouter extends React.Component {
  static defaultProps = {
    routes: []
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { routes } = this.props
    return (
      <Router>
        <React.Fragment>
          {routes.map(this.creatRoute)}
        </React.Fragment>
      </Router>
    )
  }

  creatRoute = (routeConfig, i) => {
    const { key = i, path, component: Comp, params } = routeConfig

    return (
      <Route key={key} path={path} component={props => <Comp {...props} params={params} />} />
    )
  }

}