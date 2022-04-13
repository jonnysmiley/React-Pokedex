import React from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Label,
  ModalFooter,
} from "reactstrap";

const colors = {
  fire: "#F08030",
  grass: "#78C850",
  electric: "#F8D030",
  water: "#6890F0",
  ground: "#E0C068",
  rock: "#B8A038",
  fairy: "#EE99AC",
  poison: "#A040A0",
  bug: "#A8B820",
  dragon: "#7038F8",
  ghost: "#705898",
  ice: "#98D8D8",
  steel: "#B8B8D0",
  psychic: "#F85888",
  flying: "#A890F0",
  fighting: "#C03028",
  normal: "#A8A878",
};

const defaultTypeColor = "#fff";

const defaultNumOfCol = 6;

export default class PokeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemon: [],
      isNavOpen: false,
      isModalOpen: false,
    };
    this.toggleNav = this.toggleNav.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  toggleNav() {
    this.setState({
      isNavOpen: !this.state.isNavOpen,
    });
  }

  handleLogin(event) {
    this.toggleModal();
    event.preventDefault();
  }

  generateRows(arr, columnsPerRow) {
    return arr
      .map((element, idx) => {
        const isEvenlyDivisible = !(idx % columnsPerRow);
        if (isEvenlyDivisible) {
          return arr.slice(idx, idx + columnsPerRow);
        }
      })
      .filter((val) => val);
  }

  async componentDidMount() {
    console.log("arr", this.generateRows(new Array(20).fill(true), 3));
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151`);
    console.log("list", res.data);
    const unpopulatedPokemon = res.data.results;
    const unresolvedPromises = unpopulatedPokemon.map((unpopulatedPkmn) =>
      axios.get(unpopulatedPkmn.url)
    );
    console.log("list2", unresolvedPromises);
    const populatedPokemon = (await Promise.all(unresolvedPromises)).map(
      (pkmnResult) => pkmnResult.data
    );
    this.setState({ pokemon: populatedPokemon });
  }

  render() {
    console.log("poke", this.state.pokemon);
    const rowsOfPokemon = this.generateRows(this.state.pokemon, defaultNumOfCol);
    return (
      <React.Fragment>
        <div className="container">
          {rowsOfPokemon.map((row) => {
            return (
              <div className="row">
                {row.map((poke) => (
                  <div
                    className={`card col text-white mb-1 mt-1 ml-1 mr-1 bg-danger`}
                    onClick={this.toggleModal}
                  >
                    <div className="card-header">
                      #{poke.id.toString().padStart(3, "0") + " "}
                      {poke.species.name}
                    </div>
                    <img src={poke.sprites.front_default} />
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <p
                            style={{
                              backgroundColor:
                                colors[
                                  poke.types.map((types) => types.type.name)[0]
                                ] || defaultTypeColor,
                            }}
                            className="pokeType text-white"
                          >
                            {poke.types.map((types) => types.type.name)[0]}
                          </p>
                        </div>
                        <div className="col-6">
                          <p
                            style={{
                              backgroundColor:
                                colors[
                                  poke.types.map((types) => types.type.name)[1]
                                ],
                            }}
                            className="pokeType text-white"
                          >
                            {poke.types.map((types) => types.type.name)[1]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
       
        <Modal
          isOpen={this.state.isModalOpen}
          toggle={this.toggleModal}
          className="card text-white bg-danger"
        >
          <ModalHeader className="text-black" toggle={this.toggleModal}>
            Pokemon Name
          </ModalHeader>
          <ModalBody>
            {this.state.pokemon.map((poke) => (
              <div
                className="card text-white bg-danger"
                onClick={this.toggleModal}
              >
                <div className="card-header">
                  #{poke.id.toString().padStart(3, "0") + " "}
                  {poke.species.name}
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-6">
                      <img src={poke.sprites.front_default} />
                    </div>
                    <div className="col-6">
                      {" "}
                      <img src={poke.sprites.back_default} />
                    </div>
                  </div>
                </div>
                <ul>
                  <li>Weight: {(poke.weight / 10).toFixed(1)} kg</li>
                  <li>Height: {(poke.height / 10).toFixed(1)} m</li>
                  <li>
                    Ablities:{" "}
                    {poke.abilities.map((pkmn) => pkmn.ability.name + ", ")}
                  </li>
                </ul>
                <div className="card-body">
                  <p className="pokeType text-white">
                    {poke.types.map((types) => types.type.name)[0]}
                  </p>
                  <p className="pokeType text-white">
                    {poke.types.map((types) => types.type.name)[1]}
                  </p>
                </div>
              </div>
            ))}
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
