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

function UserRow(props) {
        return (
            <tr>
                <th>
                    {props.user.id.value}
                </th>
                <td>
                    {props.user.name.title} {props.user.name.first}
                </td>
                <td>
                    {props.user.name.last}
                </td>
                <td>
                    {props.user.email}
                </td>
                <td>
                    {props.user.phone}
                </td>
                <td>
                    {props.user.location.city}
                </td>
                <td>
                    {props.user.dob}
                </td>
            </tr>
        );
}

function Pagination(props) {
    if (props.totalPages < 2) {
        return null;
    }
    const pages = [...Array(props.totalPages).keys()].map((i) => {
        const pageNumber = i + 1;
        const className = 'page-item' + (i + 1 === props.currentPage ? ' active' : '');
        return (
            <li className={className} key={i}>
                <a className="page-link" href={`#page${i + 1}`} onClick={e => props.onPageChange(i + 1, e)}>{pageNumber}</a>
            </li>
        );
    });
    const previousPageNumber = props.currentPage > 1
        ? props.currentPage - 1
        : 1;
    const nextPageNumber = props.currentPage < props.totalPages
        ? props.currentPage + 1
        : props.totalPages;
    return (
        <nav aria-label="pagination">
            <ul className="pagination">
                <li className="page-item">
                    <a className="page-link" href={`#page${previousPageNumber}`} onClick={e => props.onPageChange(previousPageNumber, e)}>
                        &laquo;
                    </a>
                </li>
                {pages}
                <li className="page-item">
                    <a className="page-link" href={`#page${nextPageNumber}`} onClick={e => props.onPageChange(nextPageNumber, e)}>
                        &raquo;
                    </a>
                </li>
            </ul>
        </nav>
    );
}

Pagination.propTypes = {
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func
};

class UsersTable extends React.Component {
    static propTypes = {
        filters: PropTypes.object,
        users: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageSize: 15
        };
    }

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

    handlePageChange(pageNumber, e) {
        e.preventDefault();
        this.setState({
            currentPage: pageNumber
        });
    }

    render() {
        let usersFiltered = [];
        this.props.users.forEach((user) => {
            if (this.filtersValidation(user)) {
                usersFiltered.push(user);
            }
        });

        const currentPos = (this.state.currentPage - 1) * this.state.pageSize,
            rows = [],
            totalPages = Math.ceil(usersFiltered.length / this.state.pageSize);

        usersFiltered = usersFiltered.slice(currentPos, currentPos + this.state.pageSize);

        usersFiltered.forEach((user) => {
            rows.push(
                <UserRow
                    user={user}
                    key={user.id.value}
                />
            );
        });

        return (
            <div>
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

                <Pagination
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange.bind(this)}
                    currentPage={this.state.currentPage} />
            </div>
        );
    };
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            totalItems: 0,
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
                    users: response.data.results,
                    totalItems: response.data.info.results
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
