const WebDriver = require('selenium-webdriver');
const By = WebDriver.By;
const Until = WebDriver.until;
const config = require('./config');
const VOTE_BTN_ID = 'voteBtn';

let isRunning = false;
let driver;

process.on('UncaughtException', () => {
    if(driver) {
        driver.quit();
    }
});

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

const doTheThing = () => {
    if(!isRunning) {
        console.log('Starting Browser...');

        driver = new WebDriver.Builder().forBrowser('chrome').build();

        console.log(`Loading ${config.url}`);

        driver.get(config.url);

        console.log('Waiting for load to finish')

        driver.wait(Until.elementIsVisible(driver.findElement(By.id(VOTE_BTN_ID))))
            .then(() => {
                console.log('Finding Vote Button');

                return driver.findElement(By.id(VOTE_BTN_ID));

            })
            .then((voteBtn) => {
                return voteBtn.getAttribute('class').then(classes => {
                    console.log(classes)
                    voteBtn.classes = classes;
                    return voteBtn;
                });
            })
            .then((voteBtn) => {
                if(voteBtn.classes.indexOf('disabled') > -1) {

                    console.log('Vote Button is disabled');

                } else {

                    voteBtn.click();

                    console.log('Voted!')
                }

                setTimeout(() => {
                    console.log('End Process.');

                    driver.quit();

                    isRunning = false;

                    const WAIT = getRandomInt(0, 60 * 60 * 1000);

                    console.log(`Executing again in ${WAIT} milliseconds`);
                    //Idk how their bot detction works so...
                    setTimeout(() => { //Wait for a random amount of time between 0 and 10 minutes.
                        doTheThing();
                    }, WAIT);
                }, 1000)


            });


    }
};

doTheThing();







