import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { parseHTML } from 'k6/html';

const baseUrl = 'http://www.load-test.ru:1080';

export default function () {
    let response;

    response = http.get(baseUrl + '/webtours/');
    check(response, {
        'GET webtours': (r) => r.status === 200,
    });

    response = http.get(baseUrl + '/cgi-bin/welcome.pl?signOff=true');
    check(response, {
        'GET welcome.pl-1': (r) => r.status === 200,
    });

    response = http.get(baseUrl + '/cgi-bin/nav.pl?in=home');
    check(response, {
        'GET nav.pl-2': (r) => r.status === 200,
    });

    let document = parseHTML(response.body);
    let userSession = document.find('input[name=userSession]').attr('value');

    console.log(`userSession: ${userSession}`);

    response = http.post(baseUrl + '/cgi-bin/login.pl', {
        'userSession': userSession,
        'username': 'w1mt23',
        'password': 'w1mt23',
        'login.x': 53,
        'login.y': 8,
        'JSFormSubmit': 'off'
    });
    check(response, {
        'POST login.pl-3': (r) => r.status === 200,
    });

    response = http.get(baseUrl + '/cgi-bin/nav.pl?page=menu&in=home');
    check(response, {
        'GET nav.pl-4': (r) => r.status === 200,
    });

    response = http.get(baseUrl + '/cgi-bin/login.pl?intro=true');
    check(response, {
        'GET login.pl-5': (r) => r.status === 200,
    });

    response = http.get(baseUrl + '/cgi-bin/welcome.pl?page=search');
    check(response, {
        'GET welcome.pl-6': (r) => r.status === 200,
    });

    response = http.get(baseUrl + '/cgi-bin/nav.pl?page=menu&in=flights');
    check(response, {
        'GET nav.pl-7': (r) => r.status === 200,
    });

    response = http.get(baseUrl + '/cgi-bin/reservations.pl?page=welcome');
    check(response, {
        'GET reservations.pl-8': (r) => r.status === 200,
    });

    document = parseHTML(response.body);

    let departureCities = document.find('select[name=depart] option').toArray();
    let arrivalCities = document.find('select[name=arrive] option').toArray();

    let fromCity = departureCities[Math.floor(Math.random() * departureCities.length)].text();
    let toCity = arrivalCities[Math.floor(Math.random() * arrivalCities.length)].text();

    console.log(`fromCity: ${fromCity}`);
    console.log(`toCity: ${toCity}`);

    response = http.post(baseUrl + '/cgi-bin/reservations.pl', {
        'advanceDiscount': 0,
        'depart': fromCity,
        'departDate': '06/08/2024',
        'arrive': toCity,
        'returnDate': '06/09/2024',
        'numPassengers': 1,
        'seatPref': 'Window',
        'seatType': 'Business',
        'findFlights.x': 35,
        'findFlights.y': 5,
        '.cgifields': ['roundtrip', 'seatType', 'seatPref']
    });
    check(response, {
        'POST reservations.pl-9': (r) => r.status === 200,
    });

    document = parseHTML(response.body);
    let flights = document.find('input[name=outboundFlight]').toArray();
    let randomFlight = flights[Math.floor(Math.random() * flights.length)].value;

    response = http.post(baseUrl + '/cgi-bin/reservations.pl', {
        'outboundFlight': randomFlight,
        'numPassengers': 1,
        'advanceDiscount': 0,
        'returnDate': '06/08/2024',
        'seatType': 'Business',
        'seatPref': 'Window',
        'reserveFlights.x': 46,
        'reserveFlights.y': 9
    });
    check(response, {
        'POST reservations.pl-10': (r) => r.status === 200,
    });

    response = http.post(baseUrl + '/cgi-bin/reservations.pl', {
        firstName: 'Danil',
        lastName: 'Idrisov',
        address1: '123 Main St',
        address2: '123 Main St',
        pass1: 'Danil Idrisov',
        creditCard: '1234567890123456',
        expDate: '12/25',
        oldCCOption: '',
        numPassengers: 1,
        seatType: 'Business',
        seatPref: 'Window',
        outboundFlight: randomFlight,
        advanceDiscount: 0,
        returnFlight: '',
        JSFormSubmit: 'off',
        'buyFlights.x': 60,
        'buyFlights.y': 11,
        '.cgifields': 'saveCC'
    });
    check(response, {
        'POST reservations.pl-11': (r) => r.status === 200,
    });

    response = http.get(baseUrl + '/cgi-bin/reservations.pl', {
        'Book Another.x': 55,
        'Book Another.y': 14
    });
    check(response, {
        'POST reservations.pl-12': (r) => r.status === 200,
    });
}
