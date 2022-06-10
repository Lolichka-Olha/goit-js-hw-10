import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(fetchCountriesByName, DEBOUNCE_DELAY)
);

function fetchCountriesByName(name) {
  const countryName = name.target.value.trim();

  if (!countryName) {
    clearCountry();
    return;
  }
  fetchCountries(countryName).then(showCountryInfo).catch(showError);
}

function createCountriesList(countries) {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="country-item">
            <img class="country__flag" src="${svg}" alt="flag" width = 30px />
            <h3 class="country-item__name">${official}</h3>
            </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function createCountryMarkup(countries) {
  const markup = countries
    .map(
      ({
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      }) => {
        return `<h2 class="country__name"><img class="country__flag" src="${svg}" alt="flag" width = 50px />${official}</h2>
    <p><b>Capital:</b> ${capital}</p>
    <p><b>Population:</b> ${population}</p>
    <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`;
      }
    )
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function showCountryInfo(countries) {
  clearCountry();
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length === 1) {
    createCountryMarkup(countries);
  } else {
    createCountriesList(countries);
  }
}

function showError(error) {
  Notify.failure('Oops, there is no country with that name');
}

function clearCountry() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
