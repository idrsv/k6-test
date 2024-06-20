import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const yaDuration = new Trend('yaDuration');
const yaReqs = new Counter('yaReqs');
const yaSuccessRate = new Rate('yaSuccessRate');

const wwwDuration = new Trend('wwwDuration');
const wwwReqs = new Counter('wwwReqs');
const wwwSuccessRate = new Rate('wwwSuccessRate');

export let options = {
    scenarios: {
        ya_scenario: {
            executor: 'ramping-vus',
            exec: 'yaRuTest',
            stages: [
                { duration: '5m', target: 60 },
                { duration: '10m', target: 60 },
                { duration: '5m', target: 72 },
                { duration: '10m', target: 72 },
            ],
        },
        www_scenario: {
            executor: 'ramping-vus',
            exec: 'wwwRuTest',
            stages: [
                { duration: '5m', target: 60 },
                { duration: '10m', target: 60 },
                { duration: '5m', target: 72 },
                { duration: '10m', target: 72 },
            ],
        },
    },
    thresholds: {
        'yaSuccessRate': ['rate>0.95'],
        'wwwSuccessRate': ['rate>0.95'],
    },
};

export function yaRuTest() {
    let yaRes = http.get('http://ya.ru');
    yaDuration.add(yaRes.timings.duration);
    yaReqs.add(1);
    yaSuccessRate.add(yaRes.status === 200);
    sleep(1);
}

export function wwwRuTest() {
    let wwwRes = http.get('http://www.ru');
    wwwDuration.add(wwwRes.timings.duration);
    wwwReqs.add(1);
    wwwSuccessRate.add(wwwRes.status === 200);
    sleep(0.5);
}

