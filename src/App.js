import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

function SearchForm() {
    return (
        <div className="card card-body bg-light mb-3">

            <div className="row">
                <div className="col-lg-5">

                    <div className="input-group mb-3">
                        <div className="input-group-prepend input-group-prepend-wide">
                            <span className="input-group-text">
                                <span>Фамилия</span>
                            </span>
                        </div>
                        <input type="text" className="form-control" />
                    </div>

                </div>
                <div className="col-lg-5">

                    <div className="input-group mb-3">
                        <div className="input-group-prepend input-group-prepend-wide">
                            <span className="input-group-text">
                                <span>
                                    Телефон
                                </span>
                            </span>
                        </div>
                        <input type="text" className="form-control" />
                    </div>

                </div>
            </div>
            <div className="row">
                <div className="col-lg-5">

                    <div className="input-group mb-3 mb-lg-0">
                        <div className="input-group-prepend input-group-prepend-wide">
                            <span className="input-group-text">
                                <span>
                                    Город
                                </span>
                            </span>
                        </div>
                        <input type="text" className="form-control" />
                    </div>

                </div>
                <div className="col-lg-5">

                    <div className="input-group mb-3 mb-lg-0">
                        <div className="input-group-prepend input-group-prepend-wide">
                            <span className="input-group-text">
                                <span>
                                    Дата рождения
                                </span>
                            </span>
                        </div>
                    </div>

                </div>
                <div className="col-lg-2">
                    <button type="button" className="btn btn-info btn-block">
                        Сброс
                    </button>
                </div>

            </div>
        </div>
    );
}

class UserRow extends React.Component {
    render() {
        const user = this.props.user;
        return (
            <tr>
                <th>
                    {user.id.value}
                </th>
                <td>
                    {user.name.title} {user.name.first}
                </td>
                <td>
                    {user.name.last}
                </td>
                <td>
                    {user.email}
                </td>
                <td>
                    {user.phone}
                </td>
                <td>
                    {user.location.city}
                </td>
                <td>
                    {user.dob}
                </td>
            </tr>
        );
    }
}

class UsersTable extends React.Component {
    render() {
        const rows = [];
        this.props.users.forEach((user) => {
            rows.push(
                <UserRow
                    user={user}
                    key={user.id.value}
                />
            );
        });

        return (
            <div className="table-responsive mb-3">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Адрес эл. почты</th>
                        <th>Телефон</th>
                        <th>Город</th>
                        <th>Дата рождения</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    };
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        axios.get('users.json')
            .then((response) => {
                this.setState({
                    users: response.data.results
                });
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }

    render() {
        return (
            <div className="App py-3">
                <div className="container">

                    <SearchForm />

                    <UsersTable users={this.state.users} />

                </div>
            </div>
        );
    }
}

export default App;
