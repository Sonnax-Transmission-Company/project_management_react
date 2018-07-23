import React, { Component } from 'react'

class Search extends Component {

	handleSearch(e) {
		this.props.searchProjects(e.target.value.toUpperCase())
	}

	render() {
		return(
			<div className="searchBox">
				<label>Search</label>
				<input type="text" onKeyUp={this.handleSearch.bind(this)} />
			</div>
		)
	}
}

export default Search