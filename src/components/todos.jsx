// •	Pull 200 data objects from the todos endpoint of jsonplaceholder as shown here: https://jsonplaceholder.typicode.com ( https://jsonplaceholder.typicode.com/ )
// •	Render a table to display that data
// o	Each row should display the userId, id, title, and completion status of each item, and should additionally have a button - DONE
// •	When any of the buttons in any of the rows are pressed, the font color of the ID number of every row with an odd ID should toggle from black to orange (or back)
// •	In the headers of each column, add a switch that allows the table to be sorted (asc and desc) based on the value of that column
// •	Above the table, render an input that filters the table entries based on their title
// •	Next to the input, render another button
// •	This button toggles the even IDs from black to green (or back)
// •	Write a comment of a few lines explaining how you might approach testing a feature like this

import React, { Component } from 'react';
import { getToDos } from '../services/todosService';
// import Pagination from './pagination';

class ToDos extends Component {
  state = {
    todos: [],
    colorOdd: false,
    colorEven: false,
    pageSize: 25,
    filterBy: null,
    sortBy: { property: 'id', orderAsc: true }
  };

  componentDidMount() {
    getToDos()
    .then(data => {
      this.setState({
        todos: data
      });
    });
  }

  handleToggleColor = (stateProperty) => {
    //it should color all odd items, not just the selected one...
    const toggledColor = !this.state[stateProperty];
    this.setState(prevState => ({
        ...prevState,
        [stateProperty]: toggledColor
    }));
  };

  sortItemsBy = (property, orderAsc) => {
    this.setState(prevState => ({
      ...prevState,
      sortBy: { property, orderAsc }
    }));
  }

  filterItems = (event) => {
    const value = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      filterBy: value
    }));
  }

  render() {
    let items = [...this.state.todos];
    if (this.state.filterBy){
      const filterBy = this.state.filterBy;
      items = items.filter(item => item.title.indexOf(filterBy) > -1);
    }
    //console.log(this.state);
    const getIdColor = todo => {
      if (todo.id % 2 === 0) {
        return this.state.colorEven ? 'green' : 'black';
      }
      else {
        return this.state.colorOdd ? 'orange' : 'black';
      }
    };

    const { property, orderAsc } = this.state.sortBy;
    items.sort((a, b) => {
      if (a[property] > b[property])
        return orderAsc ? 1 : -1;
      if (a[property] < b[property])
        return orderAsc ? -1 : 1;
      if (a[property] === b[property])
        return 0;
    });

    return (
      <div>
        <input className="m-4" type="text" onChange={this.filterItems} /> <button type="button" onClick={() => this.handleToggleColor('colorEven')}
          className="btn btn-success btn-sm">Toggle green</button>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => this.sortItemsBy('userId', !this.state.sortBy.orderAsc)}>User Id</th>
              <th onClick={() => this.sortItemsBy('id', !this.state.sortBy.orderAsc)}>Id</th>
              <th onClick={() => this.sortItemsBy('title', !this.state.sortBy.orderAsc)}>Title</th>
              <th onClick={() => this.sortItemsBy('completed', !this.state.sortBy.orderAsc)}>Completed</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map(todo => (
              <tr key={todo.id}>
                <td>{todo.userId}</td>
                <td className={getIdColor(todo)}>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.completed ? "true" : "false"}</td>
                <td>
                  <button style={{backgroundColor: 'orange', color: 'white'}}
                    onClick={() => this.handleToggleColor('colorOdd')}
                    className="btn btn-sm"
                  >
                    Toggle Orange
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <Pagination itemsCount={this.state.todos} pageSize={this.state.pageSize} onPageChange={this.handlePageChange}/> */}
      </div>
    );
  }
}

export default ToDos;
