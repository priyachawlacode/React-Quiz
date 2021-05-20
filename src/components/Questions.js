import React, { Component } from 'react';
import { ActionTypes } from '../constants/actionTypes';
import { connect } from 'react-redux';
import Submit from './Submit';

const mapStateToProps = state => ({ ...state.quiz, ...state.mode, ...state.pager });

const mapDispatchToProps = dispatch => ({
    onAnswer: payload => dispatch({ type: ActionTypes.QuizAnswer, payload }),
    onPagerUpdate: payload => dispatch({ type: ActionTypes.PagerUpdate, payload })
});

class Questions extends Component {
    state = {
        answer: []
    }

    isAnswered = (q) => {
        return q.options.some(x => x.selected) ? 'Done' : 'Undone';
    }

    move = (e) => {
        let id = e.target.id;
        let index = 0;
        if (id === 'prev')
            index = this.props.pager.index - 1;
        else if (id === 'next')
            index = this.props.pager.index + 1;
       else
            index = parseInt(e.target.id, 10);

        if (index >= 0 && index < this.props.pager.count) {
            let pager = {
                index: index,
                size: 1,
                count: this.props.pager.count
            };
            this.props.onPagerUpdate(pager);
        }
    }

    onAnswer(question, option) {
        let quiz = JSON.parse(JSON.stringify(this.props.quiz));
        let q = quiz.questions.find(x => x.id === question.id);
        if (q.questionTypeId === 1) {
            q.options.forEach((x) => { x.selected = false; });
        }
        q.options.find(x => x.id === option.id).selected = true;

        this.props.onAnswer(quiz);
        this.setState({
            answer: this.state.answer.concat(option.id)
        })
    }

    render() {
        let questions = (this.props.quiz.questions) ?
            this.props.quiz.questions.slice(this.props.pager.index, this.props.pager.index + this.props.pager.size) : [];
        return (
            <div id="quiz">
                <h2 className="text-center font-weight-normal">{this.props.quiz.name}</h2>
                <hr />
                {questions.map(q =>
                    <div key={q.id}>
                        <div className="badge badge-info">Question {this.props.pager.index + 1} of {this.props.pager.count}.</div>
                        <h3 className="font-weight-normal">{this.props.pager.index + 1}. <span>{q.name}</span></h3>
                        <div className="row text-left options">
                            {
                                q.options.map(option =>
                                    <div key={option.id} className="col-6">
                                        <div className="option">
                                            <label className="font-weight-normal" htmlFor={option.id}>
                                                <input id={option.id} checked={option.selected} type="checkbox" onChange={() => this.onAnswer(q, option)} />
                                                {option.name}
                                            </label>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )}
                <hr />
                <div className="text-center">
                    {this.props.quiz.config.allowBack && <button id="prev" className="btn btn-default" onClick={this.move}>Prev</button>}
                    <button id="next" className="btn btn-primary" onClick={this.move}>Next</button>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <h4 className="text-left font-weight-normal">Answers</h4>
                            <hr />
                            <div className="row text-center">
                                {this.props.quiz.questions.map((q, index) =>
                                    <div key={q.id} className="col-4 cursor-pointer">
                                        <div id={index} onClick={this.props.move} className={`p-3 mb-2 ${this.isAnswered(q) === 'Done' ? 'bg-success' : 'bg-info'}`}>{index + 1}. {this.isAnswered(q)}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div class="col-md-6 text-center">
                            <Submit/>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions);