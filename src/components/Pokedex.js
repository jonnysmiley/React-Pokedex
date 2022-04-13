import React, { Component } from "react";
import PokeList from "./PokeList";

export class Pokedex extends Component {
  render() {
    return (
      <>
      <div className="container">
         
            <h1>Pokedex</h1>
            <PokeList />
         
      </div>
      </>
    )
  }
}

export default Pokedex