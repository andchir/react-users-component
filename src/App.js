import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './styles.css';

registerLocale('ru', ru);

class SearchForm extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        onDateChange: PropTypes.func,
        onFiltersClear: PropTypes.func,
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
                            <input type="text" className="form-control"
                                   name="lastName"
                                   value={this.props.filters.lastName}
                                   onChange={this.props.onChange} />
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
                            <input type="text" className="form-control"
                                   name="phone"
                                   value={this.props.filters.phone}
                                   onChange={this.props.onChange} />
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
                            <input type="text" className="form-control"
                                   name="city"
                                   value={this.props.filters.city}
                                   onChange={this.props.onChange} />
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
                                name="dateOfBirth"
                                selected={this.props.filters.dateOfBirth}
                                onChange={this.props.onDateChange}
                                dateFormat="dd/MM/yyyy"
                                locale="ru"
                                placeholderText="Выбрать дату"
                                isClearable={true}
                                showMonthDropdown
                                showYearDropdown />
                        </div>

                    </div>
                    <div className="col-lg-2">
                        <button type="button" className="btn btn-info btn-block" onClick={this.props.onFiltersClear}>
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

    getValueForFilter(filterName, user) {
        let value;
        switch (filterName) {
            case 'lastName':
                value = user.name.last;
                break;
            case 'phone':
                value = user.phone;
                break;
            case 'city':
                value = user.location.city;
                break;
            case 'dateOfBirth':
                value = user.dob;
                break;
            default:
                value = ''
        }
        return value;
    }

    filtersValidation(user) {
        let itemValue, filterValue, result = true;
        for (let name in this.props.filters) {
            if (this.props.filters.hasOwnProperty(name)) {
                filterValue = this.props.filters[name];
                if (!filterValue) {
                    continue;
                }
                switch (name) {
                    case 'dateOfBirth':
                        itemValue = new Date(this.getValueForFilter(name, user));
                        const filterDateDayValue = new Date(filterValue.getFullYear(), filterValue.getMonth(), filterValue.getDate()).getTime();
                        result = new Date(itemValue.getFullYear(), itemValue.getMonth(), itemValue.getDate()).getTime() === filterDateDayValue;
                        break;
                    default:
                        result = (new RegExp(`^${filterValue}`, 'i')).test(this.getValueForFilter(name, user));
                }
                if (!result) {
                    break;
                }
            }
        }
        return result;
    }

    render() {
        const rows = [];
        this.props.users.forEach((user) => {
            if (!this.filtersValidation(user)) {
                return;
            }
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

    handleFilterChange(event) {
        const filters = Object.assign({}, this.state.filters, {[event.target.name]: event.target.value});
        this.setState({
            filters: filters
        });
    };

    handleFilterDateChange(date) {
        const filters = Object.assign({}, this.state.filters, {'dateOfBirth': date});
        this.setState({
            filters: filters
        });
    };

    handleFiltersClear() {
        const filters = Object.assign({}, this.state.filters, {
            lastName: '',
            city: '',
            phone: '',
            dateOfBirth: null
        });
        this.setState({
            filters: filters
        });
    }

    render() {
        return (
            <div className="App py-3">
                <div className="container">

                    <SearchForm
                        filters={this.state.filters}
                        onFiltersClear={this.handleFiltersClear.bind(this)}
                        onDateChange={this.handleFilterDateChange.bind(this)}
                        onChange={this.handleFilterChange.bind(this)} />

                    <UsersTable
                        filters={this.state.filters}
                        users={this.state.users} />

                </div>
            </div>
        );
    }
}

export default App;
