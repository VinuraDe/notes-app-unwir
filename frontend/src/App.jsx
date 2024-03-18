import { useState } from "react";

import { HeroSection } from "./components/HeroSection";
// import { Home } from "./components/Home";
// import { About } from "./components/About";
// import { Contact } from "./components/Contact";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
