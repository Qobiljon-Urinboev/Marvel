import {Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
  constructor (props) {
    super (props);
    this.state = {
      char: [],
      loading: true,
      error: false,
      newItemLoading: false,
      offset: 1559,
      charEnded: false,
    };
  }
  marvelService = new MarvelService ();

  setRef = (elem, id) => {
    console.log (id);
    this.myRef = elem;
  };
  componentDidMount () {
    this.onRequest ();
  }
  onRequest = offset => {
    this.onCharlistLoading ();
    this.marvelService
      .getAllCharcters (offset)
      .then (this.onCharlistLoaded)
      .catch (this.onError);
  };
  onCharlistLoading = () => {
    this.setState ({
      newItemLoading: true,
    });
  };
  onCharlistLoaded = newChar => {
    let ended = false;
    if (newChar.length === 0) {
      ended = true;
    }

    this.setState (({offset, char}) => ({
      char: [...char, ...newChar],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };
  onError = () => {
    this.setState ({
      loading: false,
      error: true,
    });
  };
  itemRefs = [];

  setRef = ref => {
    this.itemRefs.push (ref);
  };

  focusOnItem = id => {
    this.itemRefs.forEach (item =>
      item.classList.remove ('char__item_selected')
    );
    this.itemRefs[id].classList.add ('char__item_selected');
    this.itemRefs[id].focus ();
  };
  renderItems (arr) {
    const items = arr.map ((item, i) => {
      let imgStyle = {objectFit: 'cover'};
      if (
        item.thumbnail ===
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ) {
        imgStyle = {objectFit: 'unset'};
      }
      return (
        <li
          className="char__item"
          tabIndex={0}
          ref={this.setRef}
          key={item.id}
          onClick={() => {
            this.props.onCharSelected (item.id);
            this.focusOnItem (i);
          }}
          onKeyPress={e => {
            if (e.key === ' ' || e.key === 'Enter') {
              this.props.onCharSelected (item.id);
              this.focusOnItem (i);
            }
          }}
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
    const {
      char,
      loading,
      error,
      offset,
      newItemLoading,
      charEnded,
    } = this.state;
    const items = this.renderItems (char);

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
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{display: charEnded ? 'none' : 'block'}}
          onClick={() => this.onRequest (offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}
CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};
export default CharList;
