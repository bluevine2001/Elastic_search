const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const fs = require("fs");

app.use(express.json());

const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: process.env.ELASTIC_USER_PWD,
  },
  tls: {
    ca: fs.readFileSync("./http_ca.crt"),
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  // get all titles
  /* client
    .search({
      index: "michelin",
      query: {
        match_all: {},
      },
    })
    .then((result) => {
      res.send(result.hits.hits);
    })
    .catch((err) => {
      res.send(err);
    }); */
  // get a specific title
  /*  client
    .get({
      index: "titles",
      id: "3",
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    }); */
  // update a specific title
  /* client
    .update({
      index: "titles",
      id: "3",
      body: {
        doc: {
          title: "updated title",
        },
      },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    }); */
  // delete a specific title
  /* client
    .delete({
      index: "titles",
      id: "3",
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    }); */
  //create index with mapping
  /* client.indices
    .create({
      index: "ryadh-cafes",
      body: {
        mappings: {
          properties: {
            index: { type: "integer" },
            coffeeName: { type: "text" },
            rating: { type: "integer" },
            rating_count: { type: "integer" },
            URL: { type: "text" },
            hours: { type: "boolean" },
            location: { type: "geo_point" },
          },
        },
      },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    }); */

  // add data to index bulk
  client
    .bulk({
      index: "ryadh-cafes",
      body: [
        { index: { _index: "ryadh-cafes", _id: 1 } },
        {
          coffeeName: "Cacti Cafe",
          rating: "4.1",
          rating_count: "2212",
          URL: "https://www.google.com/maps/place/Cacti+Cafe/data=!4m7!3m6!1s0x3e2efde0d2059f1d:0xfca400b51ca140cc!8m2!3d24.8339855!4d46.7356133!16s%2Fg%2F11mwzvn0zx!19sChIJHZ8F0uD9Lj4RzEChHLUApPw?authuser=0&hl=en&rclk=1",
          hours: true,
          location: { type: "Point", coordinates: [46.7356133, 24.8339855] },
        },
        { index: { _index: "ryadh-cafes", _id: 2 } },
        {
          coffeeName: "Fc Lounge",
          rating: "3.5",
          rating_count: "539",
          URL: "https://www.google.com/maps/place/Fc+Lounge+-+%D8%A7%D9%81+%D8%B3%D9%8A+%D9%84%D8%A7%D9%88%D9%86%D8%AC%E2%80%AD/data=!4m7!3m6!1s0x3e2eff79d7dd770d:0xbd5029a7e12e0c2b!8m2!3d24.8131149!4d46.7680585!16s%2Fg%2F11lgkw1ffk!19sChIJDXfd13n_Lj4RKwwu4acpUL0?authuser=0&hl=en&rclk=1",
          hours: true,
          location: { type: "Point", coordinates: [46.7680585, 24.8131149] },
        },
        { index: { _index: "ryadh-cafes", _id: 3 } },
        {
          coffeeName: "PEAKS",
          rating: "4.6",
          rating_count: "25",
          URL: "https://www.google.com/maps/place/PEAKS/data=!4m7!3m6!1s0x3e2ee380585f0151:0xab784cd32a1e3d85!8m2!3d24.742045!4d46.6348092!16s%2Fg%2F11s0qh89n0!19sChIJUQFfWIDjLj4RhT0eKtNMeKs?authuser=0&hl=en&rclk=1",
          hours: false,
          location: { type: "Point", coordinates: [46.6348092, 24.742045] },
        },
        { index: { _index: "ryadh-cafes", _id: 4 } },
        {
          coffeeName: "Joffrey's",
          rating: "2.9",
          rating_count: "34",
          URL: "https://www.google.com/maps/place/Joffrey%27s+%D8%AC%D9%88%D9%81%D8%B1%D9%8A%D8%B2%E2%80%AD/data=!4m7!3m6!1s0x3e2f1d97addc7711:0xc93e4546dea3a486!8m2!3d24.7146875!4d46.6349375!16s%2Fg%2F11p00bzdsv!19sChIJEXfcrZcdLz4RhqSj3kZFPsk?authuser=0&hl=en&rclk=1",
          hours: false,
          location: { type: "Point", coordinates: [46.6349375, 24.7146875] },
        },
      ],
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/search", (req, res) => {
  // look what filters are available in the body
  console.log(req.body);
  const { hours, rating, rating_count } = req.body;
  let hoursunset = hours === null ? true : false;
  let filters = {
    index: "ryadh-caffees-test",
    body: {
      size: 20,
      query: {
        bool: {
          must: [],
        },
      },
    },
  };

  if (!hoursunset) {
    filters["body"]["query"]["bool"]["must"].push({
      match: {
        "24_hours": hours,
      },
    });
  }
  if (rating) {
    filters["body"]["query"]["bool"]["must"].push({
      range: {
        rating: {
          gte: rating,
        },
      },
    });
  }
  if (rating_count) {
    filters["body"]["query"]["bool"]["must"].push({
      range: {
        rating_count: {
          gte: rating_count,
        },
      },
    });
  }

  client
    .search(filters)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
