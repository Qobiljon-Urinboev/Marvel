import {Component} from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
  constructor (props) {
    super (props);
    this.state = {
      res: [],
      loading: true,
      error: false,
    };
  }
  marvelService = new MarvelService ();

  componentDidMount () {
    this.marvelService
      .getAllCharcters ()
      .then (this.onCharlistLoaded)
      .catch (this.onError);
  }

  onCharlistLoaded = res => {
    this.setState ({
      res,
      loading: false,
    });
  };
  onError = () => {
    this.setState ({
      loading: false,
      error: true,
    });
  };

  renderItems (arr) {
    const items = arr.map (item => {
      let imgStyle = {objectFit: 'cover'};
      if (
        item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ) {
        imgStyle = {objectFit: 'unset'};
      }
      return (
        <li
          className="char__item"
          key={item.id}
          onClick={() => this.props.onCharSelected(item.id)}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    return (
      <ul className="char__grid">
        {items}
      </ul>
    );
  }
  render () {
    const {res, loading, error} = this.state;
    const items = this.renderItems (res);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(error || loading) ? items : null;

    return (
      <div className="char__list">
        <ul className="char__grid">
          {errorMessage}
          {spinner}
          {content}

        </ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
