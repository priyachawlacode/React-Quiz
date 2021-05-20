import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Questions from './components/Questions';
import { connect } from 'react-redux';
import { ActionTypes } from './constants/actionTypes';

const mapStateToProps = state => { return { ...state.quiz } };

const mapDispatchToProps = dispatch => ({
  onQuizLoad: payload => dispatch({ type: ActionTypes.QuizLoad, payload }),
  onPagerUpdate: payload => dispatch({ type: ActionTypes.PagerUpdate, payload })
});

class App extends Component {

  pager = {
    index: 0,
    size: 1,
    count: 1
  }

  componentDidMount() {
    this.load();
  }

  load(quizId) {
    let url = 'data/javascript.json';
    fetch(`../${url}`).then(res => res.json()).then(res => {
      let quiz = res;
      quiz.questions.forEach(q => {
        q.options.forEach(o => o.selected = false);
      });
      quiz.config = Object.assign(this.props.quiz.config || {}, quiz.config);
      this.pager.count = quiz.questions.length / this.pager.size;
      this.props.onQuizLoad(quiz);
      this.props.onPagerUpdate(this.pager);
    });
  }

  render() {
    return (
      <div className="container">
        <br/>
        <Questions />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
