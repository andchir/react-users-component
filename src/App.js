import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './styles.css';

registerLocale('ru', ru);

class CustomCalendarInput extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        value: PropTypes.string,
        placeholderText: PropTypes.string
    };
    render () {
        console.log(this.props);
        return (
            <button
                className="btn btn-info btn-block"
                onClick={this.props.onClick}>
                {this.props.placeholderText}: {this.props.value ? this.props.value : 'Нет даты'}
            </button>
        )
    }
}

class SearchForm extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        filters: PropTypes.shape({
            lastName: PropTypes.string,
            city: PropTypes.string,
            phone: PropTypes.string,
            dateOfBirth: PropTypes.instanceOf(Date)
        })
    };
    render() {
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
                            <input type="text" className="form-control" onChange={(e) => this.props.onChange('lastName', e.target.value)} />
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
                            <input type="text" className="form-control" onChange={(e) => this.props.onChange('phone', e.target.value)} />
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
                            <input type="text" className="form-control" onChange={(e) => this.props.onChange('city', e.target.value)} />
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
                            <DatePicker
                                className="form-control"
                                selected={this.props.filters.dateOfBirth}
                                onChange={(date) => this.props.onChange('dateOfBirth', date)}
                                dateFormat="dd/MM/yyyy"
                                locale="ru"
                                placeholderText="Выбрать дату"
                                isClearable={true}
                                showMonthDropdown
                                showYearDropdown />
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
        this.timer = null;
        this.state = {
            users: [],
            filters: {
                lastName: '',
                city: '',
                phone: '',
                dateOfBirth: null
            }
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
                console.log(error);
            });
    }

    onFilterChange = (name, value) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            console.log('onFilterChange', name, value);
            const filters = Object.assign({}, this.state.filters, {[name]: value});
            this.setState({
                filters: filters
            });
        }, 400);
    };

    render() {
        return (
            <div className="App py-3">
                <div className="container">

                    <SearchForm
                        filters={this.state.filters}
                        onChange={this.onFilterChange.bind(this)} />

                    <UsersTable users={this.state.users} />

                </div>
            </div>
        );
    }
}

export default App;
