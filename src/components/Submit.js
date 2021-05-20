import React, { Component } from 'react';
                    
class Submit extends React.Component{

	submission(){
		alert("Thanks for Participation");
		window.location.reload();
	}

	render(){
		return <button id="submit" className="btn btn-primary" onClick={this.submission}>Submit Quiz</button>
	}
}

export default Submit;