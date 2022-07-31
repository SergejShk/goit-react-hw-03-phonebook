import { Component } from 'react';
import { Report } from 'notiflix/build/notiflix-report-aio';
import ContactForm from './contactForm/ContactForm';
import Filter from './filter/Filter';
import ContactsList from './contactsList/ContactsList';
import s from './App.module.css';

const CONTACTS = 'contacts';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem(CONTACTS);
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem(CONTACTS, JSON.stringify(this.state.contacts));
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  addContact = data => {
    if (this.checkRepeatContact(data)) {
      return Report.failure(`${data.name} is already in contacts.`);
    }

    this.setState(prev => ({ contacts: [...prev.contacts, data] }));
  };

  getFilterSearchContact = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase().trim();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  checkRepeatContact = data => {
    const { contacts } = this.state;
    return contacts.find(
      contact => contact.name.toLowerCase() === data.name.toLowerCase()
    );
  };

  deleteContact = id =>
    this.setState(prev => ({
      contacts: prev.contacts.filter(contact => contact.id !== id),
    }));

  render() {
    const { filter } = this.state;
    const filterSearchContact = this.getFilterSearchContact();

    return (
      <div className={s.container}>
        <h1 className={s.mainTitle}>Phonebook</h1>
        <ContactForm addContact={this.addContact} />
        <h2 className={s.secondaryTitle}>Contacts</h2>
        <Filter filter={filter} handleChange={this.handleChange} />
        <ContactsList
          filterSearchContact={filterSearchContact}
          deleteContact={this.deleteContact}
        />
      </div>
    );
  }
}

export default App;
