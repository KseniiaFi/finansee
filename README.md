Finansee – Moderni Budjettisovellus
Kehittäjä: Kseniia Kilina
Koulutusohjelma: Ohjelmistokehittäjä (Careeria, 2025)

Johdanto
Finansee on henkilökohtaisen talouden hallintaan kehitetty web-sovellus, jonka avulla käyttäjät voivat seurata tulojaan, menojaan ja suunnitella budjettinsa helposti ja visuaalisesti.
Projekti kehitettiin modernien teknologioiden avulla osana ohjelmistokehityksen opintoja.

Tärkeimmät ominaisuudet
Käyttäjäkohtainen rekisteröinti ja turvallinen kirjautuminen (JWT, bcrypt)

Budjetit kuukausittain, jokaisella käyttäjällä oma tietokanta

Tulojen ja menojen lisäys, muokkaus ja poisto

Kategorisointi: useita valmiita tulo- ja menoluokkia

Selkeä ja responsiivinen käyttöliittymä (React)

Visuaaliset raportit (piirakkakaavio, yhteenveto)

CSV-vienti (yhteensopiva esim. Power BI:n kanssa)

Turvallisuus: tokenit, salasanan suojaus, automaattinen uloskirjautuminen

Yksikkötestit ja API-testit (Jest, Supertest)

Käytetyt teknologiat
Frontend: React, react-router-dom, axios, recharts, papaparse, file-saver, @testing-library/react

Backend: Node.js, Express, Sequelize, SQLite (kehityksessä, voidaan siirtää PostgreSQL:ään)

Tietoturva: JWT (tokenit, tallennus localStorageen), bcrypt (salasanat), jsonwebtoken, dotenv, cors

Testaus: Jest, Supertest

Dokumentaatio: README.md, UML-kaaviot (draw.io, Violet UML Editor)

Versiohallinta: Git (paikallinen kehitys, GitHub)

Sovelluksen rakenne
Sovellus koostuu kahdesta pääosasta:

Frontend (React):
Käyttöliittymä, jossa käyttäjä rekisteröityy, kirjautuu, lisää ja tarkastelee budjettejaan, tapahtumiaan ja raportteja.

Backend (Node.js + Express):
REST-API, joka käsittelee kaikki pyynnöt, tallentaa ja hakee tiedot SQLite-tietokannasta.
Kaikki autentikointi ja käyttäjätiedot tallennetaan turvallisesti.

Tietokantarakenne (päätaulut)
users – käyttäjätiedot (sähköposti, salasana)

budgets – budjetit (kuukausi, vuosi, käyttäjän ID)

transactions – tapahtumat (tyyppi, kategoria, summa, päivämäärä, kommentti)

Asennusohjeet
Vaatimukset:

Node.js (v18 tai uudempi)

npm

Lataa projektin koodi (zip/GitHub) ja pura kansioon.

Asenna riippuvuudet:
cd server
npm install
cd ../client
npm install

Käynnistä kehityspalvelimet:
cd server
npm start
cd ../client
npm start

Avaa selain ja siirry osoitteeseen:
http://localhost:3000

Testaus
Backend:
cd server
npm test

Frontend:
cd client
npm test

Käyttöohje
Luo uusi käyttäjätunnus (Rekisteröidy)

Kirjaudu sisään

Luo uusi budjetti (kuukausi/vuosi)

Lisää tuloja ja menoja eri kategorioihin

Näe raportit, kaaviot ja vie tiedot CSV-muotoon

Muokkaa ja poista tapahtumia tarpeen mukaan

UML-kaaviot & dokumentaatio
Sovelluksen rakenne, tietokantarakenne, komponenttien vuorovaikutus ja päätoiminnot on kuvattu UML-kaavioina (löytyvät /docs-kansiosta).

Kehitys & jatkokehitys
Sovellus on suunniteltu helposti laajennettavaksi (esim. Power BI -integraatio, mobiilisovellus, useampi valuutta)

Koodi on jaettu selkeisiin moduuleihin (routes, models, middleware) ja se on helposti laajennettavissa Controller- ja Service-kerroksiin

Kaikki toiminnallisuudet dokumentoitu ja testattu

Yhteenveto
Finansee on moderni, testattu ja dokumentoitu budjettisovellus, joka auttaa käyttäjiä hallitsemaan talouttaan arjessa ja tekemään parempia päätöksiä rahankäytössä.

Yhteystiedot
Kehittäjä: Kseniia Kilina